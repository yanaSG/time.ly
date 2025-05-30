from django.contrib.auth.models import AbstractUser 
from django.db import models

class CustomUser(AbstractUser):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=30, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    fname = models.CharField(max_length=30, blank=True)
    lname = models.CharField(max_length=30, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # added fields for user profile
    image = models.ImageField(upload_to='profile/', blank=True, null=True)
    course = models.CharField(max_length=100, blank=True, null=True)
    school = models.CharField(max_length=100, blank=True, null=True)
    likes = models.PositiveIntegerField(default=0, blank=True, null=True)

    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('user', 'User'),
    ]
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')

class Notebook(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notebooks')
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=20, default='#FFD25E')
    mastery_goal = models.DateTimeField(null=True, blank=True, default=None)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        is_new = self._state.adding
        super().save(*args, **kwargs)

        if is_new:
            NotebookContent.objects.create(notebook=self)
    
class NotebookContent(models.Model):
    notebook = models.OneToOneField(Notebook, on_delete=models.CASCADE, primary_key=True, related_name='content_object')
    markdown_content = models.TextField(blank=True, default='')
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f"Content for {self.notebook.title}"

class Book(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='books')
    notebook = models.ForeignKey(Notebook, on_delete=models.CASCADE, related_name='books', null=True, blank=True)
    title = models.CharField(max_length=255)
    original_filename = models.CharField(max_length=255, blank=True)
    pdf_data = models.BinaryField()  # BLOB storage
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.original_filename})"

class BookSummary(models.Model):
    book = models.OneToOneField(Book, on_delete=models.CASCADE, related_name='summary')
    markdown = models.TextField(blank=True)
    sections = models.JSONField(default=list)
    key_terms = models.JSONField(default=list)
    
    page_count = models.IntegerField()
    processing_time = models.FloatField(null=True, blank=True)
    model_used = models.CharField(max_length=100, default='deepseek-chat')
    
    PROCESSING_STATUS = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )
    status = models.CharField(max_length=20, choices=PROCESSING_STATUS, default='pending')
    last_updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Summary of {self.book.title} ({self.status})"

    def get_structured_data(self):
        """Return parsed data for API responses"""
        return {
            'metadata': {
                'book_id': self.book.id,
                'pages': self.page_count,
                'model': self.model_used,
                'status': self.status
            },
            'sections': self.sections,
            'key_terms': self.key_terms,
            'full_markdown': self.markdown
        }