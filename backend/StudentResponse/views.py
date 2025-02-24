from django.shortcuts import render
from rest_framework import viewsets
from .models import StudentResponse
from .serializer import StudentReponseSerializer

class StudentResponseViewSet(viewsets.ModelViewSet):
    queryset = StudentResponse.objects.all()
    serializer_class = StudentReponseSerializer