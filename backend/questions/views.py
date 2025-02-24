from django.shortcuts import render
from .models import Question
from .serializer import QuestionSerializer
from rest_framework import viewsets

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
