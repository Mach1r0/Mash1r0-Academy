from django.shortcuts import render
from rest_framework import viewsets
from .models import Class
from .serializer import ClassSerializer

class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all()  
    serializer_class = ClassSerializer
