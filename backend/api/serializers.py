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
        # Create a PostItNote for the new user
        PostItNote.objects.create(user=user, title=f"{user.username}'s Note", text_content="")
        return user

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords must match."})
        if len(attrs['password']) < 6:
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
        fields = [
            'username', 'email', 'fname', 'lname',
            'image', 'school', 'course', 'likes', 'bio'
        ]

class NotebookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notebook
        fields = ['id', 'title', 'description', 'color', 'mastery_goal', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class PinnedNotebookSerializer(serializers.ModelSerializer):
    # Nested serializer to display notebook details within the pinned notebook
    notebook = NotebookSerializer(read_only=True)
    notebook_id = serializers.PrimaryKeyRelatedField(queryset=Notebook.objects.all(), write_only=True, source='notebook')

    class Meta:
        model = PinnedNotebook
        fields = ['id', 'notebook', 'notebook_id', 'order']
        read_only_fields = ['id']

    def validate(self, data):
        # Ensure the user is provided in the context for validation
        if 'request' not in self.context or not self.context['request'].user.is_authenticated:
            raise serializers.ValidationError("Authentication required for pinning notebooks.")

        user = self.context['request'].user
        notebook_to_pin = data.get('notebook') or self.instance.notebook if self.instance else None
        order = data.get('order') or self.instance.order if self.instance else None

        # If creating, or updating the notebook, check if the notebook belongs to the user
        if notebook_to_pin and notebook_to_pin.user != user:
            raise serializers.ValidationError("You can only pin your own notebooks.")

        # Check if the notebook is already pinned by the user (for create operations)
        if self.instance is None and PinnedNotebook.objects.filter(user=user, notebook=notebook_to_pin).exists():
            raise serializers.ValidationError("This notebook is already pinned.")

        # Check if the order is already taken by another pinned notebook for the user
        if order:
            existing_pinned_at_order = PinnedNotebook.objects.filter(user=user, order=order)
            if self.instance: # If updating, exclude the current instance from the check
                existing_pinned_at_order = existing_pinned_at_order.exclude(pk=self.instance.pk)
            if existing_pinned_at_order.exists():
                raise serializers.ValidationError(f"Order position {order} is already taken by another pinned notebook.")

        # Check the maximum limit of 5 pinned notebooks for create operations
        if self.instance is None and PinnedNotebook.objects.filter(user=user).count() >= 5:
            raise serializers.ValidationError("You can only pin a maximum of 5 notebooks.")

        return data

    def create(self, validated_data):
        user = self.context['request'].user
        notebook = validated_data.pop('notebook') # Get the notebook instance from the validated data
        order = validated_data.get('order')

        # If order is not provided, find the next available order
        if order is None:
            existing_orders = PinnedNotebook.objects.filter(user=user).values_list('order', flat=True)
            for i in range(1, 6): # Check orders from 1 to 5
                if i not in existing_orders:
                    order = i
                    break
            if order is None: # Should not happen if validation for max 5 notebooks is correct
                raise serializers.ValidationError("Could not determine an available order for pinning.")

        return PinnedNotebook.objects.create(user=user, notebook=notebook, order=order)

class PostItNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostItNote
        fields = ['title', 'text_content', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at'] # 'id' is now the user's PK, so it's not explicitly listed

    def create(self, validated_data):
        # For OneToOneField, the primary key is the user's ID
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Ensure that the user field is not updated for a OneToOneField
        validated_data.pop('user', None)
        return super().update(instance, validated_data)


class UserProfileSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    # Include new fields for streaks, heatmap, and pinned notebooks
    last_login_date = serializers.DateField(read_only=True)
    login_streak = serializers.IntegerField(read_only=True)
    activity_heatmap = serializers.JSONField(read_only=True)
    # Use the PinnedNotebookSerializer to serialize the many-to-many relationship
    pinned_notebooks = PinnedNotebookSerializer(source='pinnednotebook_set', many=True, read_only=True)
    # Post-it note is now a single object, not a list
    post_it_note = PostItNoteSerializer(read_only=True) # Changed from 'post_it_notes' to 'post_it_note', and many=False

    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'fname', 'lname', 'role',
            'image', 'school', 'course', 'likes', 'bio',
            'last_login_date', 'login_streak', 'activity_heatmap', 'pinned_notebooks',
            'post_it_note' # Changed from 'post_it_notes' to 'post_it_note'
        ]
        read_only_fields = fields # All fields are read-only for this serializer as it's for retrieval

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            url = obj.image.url
            if request is not None:
                return request.build_absolute_uri(url)
            return url
        return None

class ObtainTokenSerializer(TokenObtainPairSerializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

class UserActivitySerializer(serializers.Serializer):
    # Date for which activity is being reported (e.g., '2023-10-27')
    date = serializers.DateField(required=True)
    # Duration of activity in minutes
    duration_minutes = serializers.IntegerField(required=True, min_value=0)


class NotebookContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotebookContent
        fields = ['notebook', 'markdown_content', 'updated_at']
        read_only_fields = ['updated_at']

class BookUploadSerializer(serializers.ModelSerializer):
    pdf_file = serializers.FileField(write_only=True, required=True)
    user_id = serializers.IntegerField(write_only=True, required=True)
    notebook_id = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        model = Book
        fields = ['user_id', 'notebook_id', 'title', 'pdf_file']

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
