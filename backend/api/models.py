from django.contrib.auth.models import AbstractUser 
from django.db import models

class CustomUser(AbstractUser):
    username = models.CharField(max_length=30, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    fname = models.CharField(max_length=30, blank=True)
    lname = models.CharField(max_length=30, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('user', 'User'),
    ]
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')

class Book(models.Model):
    title = models.CharField(max_length=255)
    original_filename = models.CharField(max_length=255, blank=True)
    pdf_data = models.BinaryField()  # BLOB storage
    uploaded_at = models.DateTimeField(auto_now_add=True)
    domain = models.CharField(max_length=100, choices=[
        ('cs', 'Computer Science'),
        ('medicine', 'Medicine'),
        ('physics', 'Physics'),
        ('religion', 'Religion'),
    ])

    def __str__(self):
        return f"{self.title} ({self.original_filename})"

class BookSummary(models.Model):
    book = models.OneToOneField(Book, on_delete=models.CASCADE, related_name='summary')
    structured_outline = models.JSONField(help_text="Hierarchical outline with sections")
    key_definitions = models.JSONField(help_text="Glossary of terms")
    critical_quotes = models.TextField(blank=True)
    tl_dr = models.TextField(help_text="One-paragraph summary")
    processed_at = models.DateTimeField(auto_now_add=True)

    def get_outline_as_markdown(self):
        return "\n".join(self._generate_markdown(self.structured_outline))
    
    def _generate_markdown(self, items, level=0):
        lines = []
        for item in items:
            lines.append(f"{'#' * (level + 1)} {item['heading']}")
            if item.get('summary'):
                lines.append(item['summary'])
            if item.get('children'):
                lines.extend(self._generate_markdown(item['children'], level+1))
        return lines