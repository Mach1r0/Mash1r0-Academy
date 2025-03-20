from django.shortcuts import render
from rest_framework import viewsets
from .models import StudentResponse
from .serializer import StudentReponseSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class StudentResponseViewSet(viewsets.ModelViewSet):
    queryset = StudentResponse.objects.all()
    serializer_class = StudentReponseSerializer

class StudentThemeProgressViewSet(viewsets.ViewSet): 
    @action(detail=False, methods=['GET'])
    def theme_progress(self, request):
        student_id = request.query_params.get('student_id')
        theme_id = request.query_params.get('theme_id')  

        if not student_id or not theme_id:
            return Response({'error': 'user or theme id not provided'})
        
        try:
            correct_count = StudentResponse.objects.filter(
                student_id=student_id, 
                question__themes__id=theme_id, 
                booleaniscorrect=True
            ).count()

            from theme.models import Theme 
            total_questions = Theme.objects.get(id=theme_id).questions.count()
            
            return Response({
                'correct_count': correct_count, 
                'total_questions': total_questions,
                'completion_percentage': (correct_count / total_questions * 100) if total_questions > 0 else 0 
            })
        except Exception as e:
            return Response({'error': str(e)})