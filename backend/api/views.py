import io
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from django.http import HttpResponse, JsonResponse, FileResponse
from django.utils.text import slugify
from django.conf import settings
from django.shortcuts import get_object_or_404
from .serializers import *
from .models import *
import openai
import os
import requests
from django.views.decorators.csrf import csrf_exempt
import json
import logging
import urllib
import PyPDF2
from .services.pdf_processor import ChapterProcessor
import pdfplumber
from django.db import transaction
from dotenv import load_dotenv
from datetime import date, timedelta

load_dotenv()
logger = logging.getLogger(__name__)

@csrf_exempt
def chat_with_deepseek(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            messages = data.get("messages", [])

            api_token = os.getenv("CHUTES_API_TOKEN")
            if not api_token:
                return JsonResponse({"error": "API token not found in environment."}, status=500)

            headers = {
                "Authorization": f"Bearer {api_token}",
                "Content-Type": "application/json",
            }

            payload = {
                "model": "deepseek-ai/DeepSeek-R1",
                "messages": messages,
                "stream": False,
                "max_tokens": 1024,
                "temperature": 0.7
            }

            response = requests.post(
                "https://llm.chutes.ai/v1/chat/completions",
                headers=headers,
                json=payload
            )

            response.raise_for_status()
            return JsonResponse(response.json())

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.save()

            # Generate token for the newly registered user
            token = ObtainTokenSerializer.get_token(user)

            return Response({
                'status': 'success',
                'message': 'User registered successfully.',
                'access': str(token.access_token),
                'refresh': str(token),
            }, status=status.HTTP_201_CREATED)
        except Exception:
            return Response({
                'status': 'error',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

class UserProfileUpdateView(generics.UpdateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileUpdateSerializer

    def get_object(self):
        return self.request.user

class UserProfileDetailsView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user


class LoginView(generics.GenericAPIView):
    serializer_class = ObtainTokenSerializer

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {"error": "Both 'username' and 'password' are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(request, username=username, password=password)

        if user is not None:
            # Update login streak only (heatmap activity will be tracked separately)
            today = date.today()
            if user.last_login_date:
                if user.last_login_date == today - timedelta(days=1):
                    user.login_streak += 1
                elif user.last_login_date != today:
                    user.login_streak = 1 # Reset streak if not consecutive
            else:
                user.login_streak = 1 # Start streak for first login

            user.last_login_date = today
            user.save() # Save the updated user object with streak

            token = ObtainTokenSerializer.get_token(user)
            return Response({
                'access': str(token.access_token),
                'refresh': str(token),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'last_login_date': user.last_login_date,
                    'login_streak': user.login_streak,
                    'activity_heatmap': user.activity_heatmap, # Still return current heatmap data
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class UserActivityView(generics.UpdateAPIView):
    serializer_class = UserActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def patch(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = self.get_object()
        activity_date_str = serializer.validated_data['date'].isoformat()
        duration_minutes = serializer.validated_data['duration_minutes']

        # Get current heatmap, or initialize if empty
        heatmap = user.activity_heatmap if user.activity_heatmap is not None else {}

        # Add the new duration to the existing duration for that day
        heatmap[activity_date_str] = heatmap.get(activity_date_str, 0) + duration_minutes

        user.activity_heatmap = heatmap
        user.save(update_fields=['activity_heatmap']) # Only update the heatmap field

        return Response({
            "status": "success",
            "message": "Activity heatmap updated.",
            "activity_heatmap": user.activity_heatmap
        }, status=status.HTTP_200_OK)


class NotebookListCreateView(generics.ListCreateAPIView):
    serializer_class = NotebookSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notebook.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class NotebookDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NotebookSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notebook.objects.filter(user=self.request.user)

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, pk=self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"message": "Notebook deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )

class NotebookContentView(generics.RetrieveUpdateAPIView):
    queryset = NotebookContent.objects.all()
    serializer_class = NotebookContentSerializer
    lookup_field = 'notebook'

class PinnedNotebookListCreateView(generics.ListCreateAPIView):
    serializer_class = PinnedNotebookSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return pinned notebooks for the authenticated user, ordered by 'order'
        return PinnedNotebook.objects.filter(user=self.request.user).order_by('order')

    def perform_create(self, serializer):
        # The serializer's create method handles the notebook and order logic
        serializer.save(user=self.request.user)

class PinnedNotebookDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PinnedNotebookSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk' # Use 'pk' for the primary key of PinnedNotebook

    def get_queryset(self):
        # Ensure only the user's own pinned notebooks can be accessed
        return PinnedNotebook.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        # Ensure the user cannot change the 'user' field
        serializer.save(user=self.request.user)

class PostItNoteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostItNoteSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Retrieve the single PostItNote for the authenticated user
        # If it doesn't exist, return None, and the create method will handle it for POST requests
        try:
            return self.request.user.post_it_note
        except PostItNote.DoesNotExist:
            return None

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            # If no note exists, return a 404 or an empty response, depending on desired client behavior
            return Response({"detail": "No post-it note found for this user."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        # Allow creating the note if it doesn't exist yet
        if self.get_object() is not None:
            return Response({"detail": "A post-it note already exists for this user. Use PUT or PATCH to update."},
                            status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=self.request.user) # Ensure the note is linked to the current user
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            return Response({"detail": "No post-it note found to update. Use POST to create one."},
                            status=status.HTTP_404_NOT_FOUND)
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            return Response({"detail": "No post-it note found to update. Use POST to create one."},
                            status=status.HTTP_404_NOT_FOUND)
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            return Response({"detail": "No post-it note found to delete."},
                            status=status.HTTP_404_NOT_FOUND)
        return self.destroy(request, *args, **kwargs)


class BookListCreateView(generics.ListCreateAPIView):
    serializer_class = BookResponseSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        return BookUploadSerializer if self.request.method == 'POST' else BookResponseSerializer

    def get_queryset(self):
        notebook_id = self.kwargs.get("notebook_id")
        user_id = self.request.data.get("user_id")
        queryset = Book.objects.filter(notebook_id=notebook_id).order_by('-uploaded_at')
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        return queryset

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        notebook_id = self.kwargs.get("notebook_id")
        print("Validating PDF upload...")
        try:
            pdf_file = request.FILES['pdf']
            pdf_data = pdf_file.read()
            if not pdf_data.startswith(b'%PDF-'):
                raise ValueError("Invalid PDF header")
            with pdfplumber.open(io.BytesIO(pdf_data)) as pdf:
                if not any(page.extract_text() for page in pdf.pages[:2]):
                    raise ValueError("No readable text in first 2 pages")
        except Exception as e:
            return Response({"error": f"PDF validation failed: {str(e)}"}, status=400)
        try:
            if not request.user.is_authenticated:
                return Response({"error": "Authentication required to upload a book."}, status=401)
            book = Book(
                user=request.user,
                notebook_id=notebook_id,
                original_filename=pdf_file.name,
                title=pdf_file.name,
                pdf_data=pdf_data
            )
            processor = ChapterProcessor()
            result = processor.process(pdf_data)
            if result['status'] != 'processing_completed':
                raise RuntimeError(result.get('message', 'Unknown processing error'))
            book.save()
            BookSummary.objects.create(
                book=book,
                markdown=result.get('markdown', '# Summary\n\nProcessing completed'),
                sections=result.get('sections', []),
                key_terms=result.get('key_terms', []),
                page_count=result.get('page_count', 0),
                processing_time=result.get('processing_time'),
                status='completed',
                model_used=processor.model_name
            )
            return Response({
                "status": "success",
                "book_id": book.id,
                "markdown_summary": result.get('markdown', '')
            }, status=201)
        except Exception as e:
            error_type = "processing_error"
            error_msg = str(e)
            if "API Error" in error_msg:
                error_type = "api_error"
                error_msg = "Summary service unavailable. Please try again later."
            elif "exceeded" in error_msg:
                error_type = "limit_exceeded"
                error_msg = "Daily processing limit exceeded. Please try again tomorrow."
            logger.error(f"Book processing failed: {e}", exc_info=True)
            return Response({
                "status": "error",
                "message": error_msg,
                "type": error_type
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BookDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BookResponseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        notebook_id = self.kwargs.get("notebook_id")
        return Book.objects.filter(notebook_id=notebook_id, user=self.request.user)

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, pk=self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj
    
class BookTitleListView(generics.ListAPIView):
    serializer_class = BookResponseSerializer

    def get_queryset(self):
        notebook_id = self.kwargs.get("notebook_id")
        return Book.objects.filter(notebook_id=notebook_id).only("id", "title")

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        titles = [{"id": book.id, "title": book.title} for book in queryset]
        return Response(titles)

class BookDownloadView(generics.RetrieveAPIView):
    serializer_class = BookResponseSerializer

    def get_queryset(self):
        notebook_id = self.kwargs.get("notebook_id")
        return Book.objects.filter(notebook_id=notebook_id)

    def get(self, request, *args, **kwargs):
        document = self.get_object()
        filename = document.original_filename or f"{slugify(document.title)}.pdf"
        encoded_filename = urllib.parse.quote(filename)
        response = HttpResponse(
            document.pdf_data,
            content_type='application/pdf'
        )
        response['Content-Disposition'] = f'attachment; filename="{filename}"; filename*=UTF-8\'\'{encoded_filename}'
        return response

class BookViewInBrowser(generics.RetrieveAPIView):
    serializer_class = BookResponseSerializer

    def get_queryset(self):
        notebook_id = self.kwargs.get("notebook_id")
        return Book.objects.filter(notebook_id=notebook_id)

    def get(self, request, *args, **kwargs):
        document = self.get_object()
        filename = document.original_filename or f"{slugify(document.title)}.pdf"
        encoded_filename = urllib.parse.quote(filename)
        response = HttpResponse(
            document.pdf_data,
            content_type='application/pdf'
        )
        response['Content-Disposition'] = f'inline; filename="{filename}"; filename*=UTF-8\'\'{encoded_filename}'
        return response

class BookSummaryDetailView(generics.RetrieveAPIView):
    serializer_class = BookSummarySerializer

    def get_queryset(self):
        notebook_id = self.kwargs.get("notebook_id")
        return BookSummary.objects.filter(book__notebook_id=notebook_id)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
