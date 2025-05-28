import io
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
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

load_dotenv()  # Loads CHUTES_API_TOKEN from .env file
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
                "stream": False,  # Change to True if handling streaming in future
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
    queryset = CustomUser .objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate token for the newly registered user
        token = ObtainTokenSerializer.get_token(user)

        return Response({
            'status': 'success',
            'message': 'User  registered successfully.',
            'access': str(token.access_token),
            'refresh': str(token),
        }, status=status.HTTP_201_CREATED)

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
            token = ObtainTokenSerializer.get_token(user)
            return Response({
                'access': str(token.access_token),
                'refresh': str(token),
                'username': user.username
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class NotebookListCreateView(generics.ListCreateAPIView):
    serializer_class = NotebookSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return notebooks that belong to the logged-in user
        return Notebook.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically set the user when saving a new notebook
        serializer.save(user=self.request.user)
        


class BookListCreateView(generics.ListCreateAPIView):
    queryset = Book.objects.all().order_by('-uploaded_at')
    
    def get_serializer_class(self):
        return BookUploadSerializer if self.request.method == 'POST' else BookResponseSerializer
    
    @transaction.atomic
    def create(self, request):
        # Validate PDF
        try:
            pdf_file = request.FILES['pdf']
            pdf_data = pdf_file.read()  # Read once and reuse
            
            # Basic PDF validation
            if not pdf_data.startswith(b'%PDF-'):
                raise ValueError("Invalid PDF header")
                
            # Quick text extraction test
            with pdfplumber.open(io.BytesIO(pdf_data)) as pdf:
                if not any(page.extract_text() for page in pdf.pages[:2]):
                    raise ValueError("No readable text in first 2 pages")
                    
        except Exception as e:
            return Response({"error": f"PDF validation failed: {str(e)}"}, status=400)

        # Start processing (inside atomic transaction)
        try:
            # Create Book instance (not saved yet)
            if not request.user.is_authenticated:
                return Response({"error": "Authentication required to upload a book."}, status=401)

            book = Book(
                user=request.user,
                original_filename=request.data.get('original_filename', pdf_file.name),
                title=request.data.get('title', pdf_file.name),
                pdf_data=pdf_data
            )
            
            # Initialize processor with error handling
            processor = ChapterProcessor()
            result = processor.process(pdf_data)
            
            if result['status'] != 'processing_completed':
                raise RuntimeError(result.get('message', 'Unknown processing error'))
            
            # Save book and summary (atomic)
            book.save()
            
            BookSummary.objects.create(
                book=book,
                markdown=result.get('markdown', '# Summary\n\nProcessing completed'),
                sections=result.get('sections', []),  # Changed from 'headings' to 'sections'
                key_terms=result.get('key_terms', []),
                page_count=result.get('page_count', 0),
                processing_time=result.get('processing_time'),  # Added processing_time
                status='completed',
                model_used=processor.model_name
            )

            return Response({
                "status": "success",
                "book_id": book.id,
                "summary": {
                    "sections": result.get('sections', []),
                    "key_terms": result.get('key_terms', []),
                    "page_count": result.get('page_count', 0)
                }
            }, status=201)

        except Exception as e:
            error_type = "processing_error"
            error_msg = str(e)
            
            # Special handling for common cases
            if "API Error" in error_msg:
                error_type = "api_error"
                error_msg = "Summary service unavailable. Please try again later."
            elif "memory" in error_msg.lower():
                error_type = "resource_error"
                error_msg = "Document too large for processing."
                
            return Response({
                "error": error_msg,
                "type": error_type
            }, status=400)

    
class BookDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Handle GET (detail), PUT/PATCH (update), and DELETE operations
    """
    queryset = Book.objects.all()
    serializer_class = BookResponseSerializer

    def get_object(self):
        """Override to provide custom lookup"""
        queryset = self.filter_queryset(self.get_queryset())
        obj = get_object_or_404(queryset, pk=self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj

    def perform_update(self, serializer):
        """Handle PDF and title update if included"""
        pdf_file = self.request.FILES.get('pdf_file')
        if pdf_file:
            serializer.validated_data['pdf_data'] = pdf_file.read()
        title = self.request.data.get('title')
        if title is not None:
            serializer.validated_data['title'] = title
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        """Custom delete response"""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"message": "Document deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )
    
class BookDownloadView(generics.RetrieveAPIView):
    queryset = Book.objects.all()
    
    def get(self, request, *args, **kwargs):
        document = self.get_object()
        
        # Use original filename if available, fallback to slugified title
        filename = document.original_filename or f"{slugify(document.title)}.pdf"
        
        # URL-encode the filename for proper handling
        encoded_filename = urllib.parse.quote(filename)
        
        response = HttpResponse(
            document.pdf_data, 
            content_type='application/pdf'
        )
        response['Content-Disposition'] = f'attachment; filename="{filename}"; filename*=UTF-8\'\'{encoded_filename}'
        return response

class BookViewInBrowser(generics.RetrieveAPIView):
    queryset = Book.objects.all()
    
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
    
class BookSummaryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookSummary.objects.all()
    serializer_class = BookSummarySerializer