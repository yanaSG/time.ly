"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.views import *
from api.views import *
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', RegisterView.as_view(), name='auth_register'),
    path('api/register/profile/', UserProfileUpdateView.as_view(), name='user_profile_update'),
    path('api/profile/', UserProfileDetailsView.as_view(), name='user_profile'),
    path('api/login/', LoginView.as_view(), name='auth_login'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path("api/chat/", chat_with_deepseek),

    path('api/notebooks/', NotebookListCreateView.as_view(), name='notebook-list-create'),
    path('api/notebooks/<int:pk>/', NotebookDetailView.as_view(), name='notebook-detail'),
    path('api/notebooks/<int:notebook>/content/', NotebookContentView.as_view(), name='notebook-content'),

    path('api/notebooks/<int:notebook_id>/books/', BookListCreateView.as_view(), name='document-list'),
    path('api/notebooks/<int:notebook_id>/books/<int:pk>/', BookDetailView.as_view(), name='document-detail'),
    path('api/notebooks/<int:notebook_id>/books/<int:pk>/download/', BookDownloadView.as_view(), name='document-download'),
    path('api/notebooks/<int:notebook_id>/books/<int:pk>/view/', BookViewInBrowser.as_view(), name='document-view'),
    path('api/notebooks/<int:notebook_id>/books/<int:pk>/summary/', BookSummaryDetailView.as_view(), name='document-summary-detail'),
    path('api/notebooks/<int:notebook_id>/books/titles/', BookTitleListView.as_view(), name='book-title-list')
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
