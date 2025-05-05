from django.shortcuts import render
from .models import Question
from .serializer import QuestionSerializer
from rest_framework import viewsets

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

class QuestionsByThemeViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer

    def get_queryset(self):
        theme_id = self.kwargs.get('theme_id')
        return Question.objects.filter(theme__id=theme_id)
    
class QuestionsBySubThemeViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer

    def get_queryset(self):
        subtheme_id = self.kwargs.get('subtheme_id')
        return Question.objects.filter(subtheme__id=subtheme_id)