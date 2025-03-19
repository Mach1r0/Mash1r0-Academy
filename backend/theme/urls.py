from django.urls import path 
from .views import ThemeViewSet, SubThemeViewSet

urlpatterns = [
    path('theme/', ThemeViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('theme/<slug:slug>/', ThemeViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),
    path('subtheme/', SubThemeViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('subtheme/<slug:slug>/', SubThemeViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),
]