from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from .serializers import *
from .models import * 

import os
import json
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from dotenv import load_dotenv

load_dotenv()  # Loads CHUTES_API_TOKEN from .env file

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
        

