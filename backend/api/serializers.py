from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import base64

class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    fname = serializers.CharField(required=True)
    lname = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)
    

    class Meta:
        model = CustomUser 
        fields = ['id', 'username', 'email', 'fname', 'lname', 'role', 'password', 'password2']

    def create(self, validated_data):
        validated_data.pop('password2', None)
        user = CustomUser (**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords must match."})
        if len(attrs['password']) <= 6:
            raise serializers.ValidationError({"password": "Password must be more than 6 characters."})
        return attrs

    def validate_username(self, value):
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value
    
    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already used.")
        return value
    
class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['image', 'school', 'course', 'likes']
        extra_kwargs = {
            'image': {'required': False},
            'school': {'required': False},
            'course': {'required': False},
            'likes': {'required': False},
        }
        
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'fname', 'lname', 'role', 'image', 'school', 'course', 'likes']
        read_only_fields = ['id', 'username', 'email', 'fname', 'lname', 'role', 'image', 'school', 'course', 'likes']

class ObtainTokenSerializer(TokenObtainPairSerializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

class NotebookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notebook
        fields = ['id', 'title', 'description', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    
class NotebookContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotebookContent
        fields = ['notebook', 'markdown_content', 'updated_at']
        read_only_fields = ['updated_at']

class BookUploadSerializer(serializers.ModelSerializer):
    pdf_file = serializers.FileField(write_only=True, required=True)

    class Meta:
        model = Book
        fields = ['user_id', 'notebook_id', 'title', 'pdf_file', 'domain']
    
    def create(self, validated_data):
        pdf_file = validated_data.pop('pdf_file')
        user_id = validated_data.get('user_id')
        notebook_id = validated_data.get('notebook_id')
        return Book.objects.create(
            user_id=user_id,
            notebook_id=notebook_id,
            title=validated_data.get('title', pdf_file.name),
            original_filename=pdf_file.name,
            pdf_data=pdf_file.read()
        )

class BookResponseSerializer(serializers.ModelSerializer):
    download_url = serializers.SerializerMethodField()
    view_url = serializers.SerializerMethodField()
    original_filename = serializers.CharField(read_only=True)

    class Meta:
        model = Book
        fields = ['user_id', 'notebook_id', 'title', 'original_filename', 'uploaded_at', 'download_url', 'view_url']

    def get_download_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(f'/documents/{obj.id}/download/') if request else None

    def get_view_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(f'/documents/{obj.id}/view/') if request else None
    
class BookSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = BookSummary
        fields = '__all__'