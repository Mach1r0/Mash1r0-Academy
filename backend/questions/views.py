from django.shortcuts import render
from .models import Question
from .serializer import QuestionSerializer, QuestionListSerializer
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from StudentResponse.models import StudentResponse

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
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
    
    @action(detail=False, methods=['get'])
    def by_student(self, request, student_id=None):
        """
        Retorna todas as questões que um estudante respondeu.
        """
        if not student_id:
            student_id = request.query_params.get('student_id')
            
        if not student_id:
            return Response({"error": "student_id é obrigatório"}, status=400)
            
        # Encontra todos os IDs de questões respondidas pelo estudante
        question_ids = StudentResponse.objects.filter(
            student_id=student_id
        ).values_list('question_id', flat=True)
        
        # Filtra as questões pelos IDs encontrados
        questions = Question.objects.filter(id__in=question_ids)
        
        serializer = QuestionListSerializer(questions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def correct_by_student(self, request, student_id=None):
        """
        Retorna todas as questões que um estudante respondeu corretamente.
        """
        if not student_id:
            student_id = request.query_params.get('student_id')
            
        if not student_id:
            return Response({"error": "student_id é obrigatório"}, status=400)
            
        # Encontra todos os IDs de questões respondidas corretamente pelo estudante
        question_ids = StudentResponse.objects.filter(
            student_id=student_id,
            booleaniscorrect=True  # Use o nome correto do campo aqui
        ).values_list('question_id', flat=True)
        
        # Filtra as questões pelos IDs encontrados
        questions = Question.objects.filter(id__in=question_ids)
        
        serializer = QuestionListSerializer(questions, many=True)
        return Response(serializer.data)