from django.shortcuts import render
from rest_framework import viewsets
from .models import Teacher
from .serializer import TeacherSerializer  

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer