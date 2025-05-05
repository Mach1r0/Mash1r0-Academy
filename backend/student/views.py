from django.shortcuts import render
from rest_framework import viewsets, permissions, response, status
from rest_framework.decorators import action
from .models import Student
from .serializer import StudentSerializer
from StudentResponse.models import StudentResponse

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    
