from django.shortcuts import render
from rest_framework import viewsets
from .models import Theme, SubTheme
from .serializer import ThemeSerializer, SubThemeSerializer

class ThemeViewSet(viewsets.ModelViewSet):
    queryset = Theme.objects.all()
    serializer_class = ThemeSerializer
    lookup_field = 'slug'
    
class SubThemeViewSet(viewsets.ModelViewSet):
    queryset = SubTheme.objects.all() 
    serializer_class = SubThemeSerializer  
