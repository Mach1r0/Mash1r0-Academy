from django.urls import path
from .views import StudentThemeProgressViewSet

urlpatterns = [
    path('theme-progress/', StudentThemeProgressViewSet.as_view({'get': 'theme_progress'}), name='theme_progress')
]