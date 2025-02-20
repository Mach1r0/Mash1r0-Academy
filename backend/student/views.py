from django.shortcuts import render
from rest_framework import viewsets
from .models import Studant
from .serializer import StudentSerializer

class StudantViewSet(viewsets.ModelViewSet):
    queryset = Studant.objects.all()
    serializer_class = StudentSerializer
    