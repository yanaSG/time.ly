import io
from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from django.http import HttpResponse, JsonResponse, FileResponse
from django.utils.text import slugify
from django.conf import settings
from django.shortcuts import get_object_or_404
from .serializers import *
from .models import * 
import base64
import openai
from django.views.decorators.csrf import csrf_exempt
import json
import logging
import urllib
from .tasks import process_academic_pdf
import PyPDF2

logger = logging.getLogger(__name__)


openai.api_key = settings.OPENAI_API_KEY

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
        

@csrf_exempt
def chat_with_gpt(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            messages = data.get("messages", [])

            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=messages
            )
            return JsonResponse(response)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request"}, status=400)

class BookListCreateView(generics.ListCreateAPIView):
    queryset = Book.objects.all().order_by('-uploaded_at')
    
    def get_serializer_class(self):
        return BookUploadSerializer if self.request.method == 'POST' else BookResponseSerializer
    
    def create(self, request):
        # Validate PDF
        try:
            PyPDF2.PdfReader(io.BytesIO(request.FILES['pdf'].read()))
        except:
            return Response({"error": "Invalid PDF"}, status=400)

        # Save book
        book = Book.objects.create(
            title=request.data.get('title'),
            pdf_data=request.FILES['pdf'].read(),
            domain=request.data.get('domain')
        )
        
        # Start processing
        process_academic_pdf.delay(book.id)
        
        return Response({
            "status": "processing_started",
            "book_id": book.id
        }, status=202)
    
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