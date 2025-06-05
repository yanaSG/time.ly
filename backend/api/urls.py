from django.urls import path
from .views import NotebookSuggestionView

urlpatterns = [
    
    path('notebook-suggestion/', NotebookSuggestionView.as_view(), name='notebook-suggestion'),
]