from django.shortcuts import render
from .models import Question
from .serializer import QuestionSerializer, QuestionListSerializer
from rest_framework import viewsets
from rest_framework.response import Response

class QuestionViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer
    
    def get_queryset(self):
        queryset = Question.objects.all()
        theme_id = self.request.query_params.get('theme_id')
        
        if theme_id:
            queryset = queryset.filter(theme_id=theme_id)
            
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'list':
            return QuestionListSerializer
        return QuestionSerializer