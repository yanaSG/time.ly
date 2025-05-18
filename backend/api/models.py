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


class Notebook(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notebooks')
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title