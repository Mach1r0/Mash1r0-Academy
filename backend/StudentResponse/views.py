from django.shortcuts import render
from rest_framework import viewsets
from .models import StudentResponse
from .serializer import StudentReponseSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, permissions, response, status
from rest_framework.decorators import api_view

class StudentResponseViewSet(viewsets.ModelViewSet):
    queryset = StudentResponse.objects.all()
    serializer_class = StudentReponseSerializer

class ProgressThemeProgressViewSet(viewsets.ViewSet): 
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
        
class ProgressSubThemeViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request, subtheme_id=None, student_id=None):
        if not request.user.is_authenticated:
            return response.Response(
                {"error": "Authentication required"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not subtheme_id or not student_id:
            return response.Response(
                {"error": "Both subtheme_id and student_id are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        student_responses = StudentResponse.objects.filter(
            question__subtheme_id=subtheme_id,
            student_id=student_id
        ).values('question__id', 'booleaniscorrect')
        
        result = {
            'student_id': student_id,
            'subtheme_id': subtheme_id,
            'responses': list(student_responses)
        }
        
        return response.Response(result)
    
@api_view(['GET'])
def student_answered_questions(request):
    student_id = request.query_params.get('student_id')
    
    if not student_id:
        return Response({'error': 'student_id not provided'})
    
    try:
        student_id = int(student_id)
        
        answered_questions = StudentResponse.objects.filter(
            student_id=student_id
        ).values_list('question_id', flat=True)
        
        return Response({'answered_question_ids': list(answered_questions)})
    except Exception as e:
        return Response({'error': str(e)})