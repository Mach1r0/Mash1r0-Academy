from django.urls import path, include
from .views import RegisterUser, LoginView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings 
from django.conf.urls.static import static

urlpatterns = [ 
    path('register/', RegisterUser.as_view(), name='register'), 
    path('login/', LoginView.as_view() if hasattr(LoginView, 'as_view') else LoginView),  
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)