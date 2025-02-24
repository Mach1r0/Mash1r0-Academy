from django.shortcuts import render
from rest_framework import viewsets 
from .models import Content 
from .serializer import ContentSerializer

class ContentViewSet(viewsets.ViewSet):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer

