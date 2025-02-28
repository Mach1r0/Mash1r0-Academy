from django.urls import Path 
from .views import RegisterUser, LoginView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings 
from django.conf.urls.static import static


url_patterns = [ 
    Path('register/', RegisterUser.as_view(), name='register'), 
    Path('login/', LoginView)
] + static(settings.MEDIS_URL, document_root=settings.MEDIA_ROOT)