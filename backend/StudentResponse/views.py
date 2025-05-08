from django.shortcuts import render
from rest_framework import viewsets
from .models import StudentResponse
from .serializer import StudentReponseSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, permissions, response, status
from rest_framework.decorators import api_view
from questions.models import Question  
from theme.models import Theme

class StudentResponseViewSet(viewsets.ModelViewSet):
    queryset = StudentResponse.objects.all()
    serializer_class = StudentReponseSerializer


class ProgressThemeProgressViewSet(viewsets.ViewSet): 
    @action(detail=False, methods=['GET'])
    def theme_progress(self, request):
        student_id = request.query_params.get('student_id')
        theme_id = request.query_params.get('theme_id')  

        if not student_id or not theme_id:
            return Response({'error': 'student_id or theme_id not provided'})

        try:
            # Get the theme
            theme = Theme.objects.get(id=theme_id)
            
            # Get all questions for this theme
            theme_questions = Question.objects.filter(theme=theme).values_list('id', flat=True)
            total_questions = len(theme_questions)
            
            if total_questions == 0:
                return Response({
                    'answered_count': 0,
                    'correct_count': 0,
                    'total_questions': 0,
                    'completion_percentage': 0,
                    'accuracy_percentage': 0
                })
            
            # Find answered questions by this student for this theme
            answered_responses = StudentResponse.objects.filter(
                student_id=student_id,
                question_id__in=theme_questions
            )
            
            # Count unique answered questions
            answered_question_ids = answered_responses.values_list('question_id', flat=True).distinct()
            answered_count = len(answered_question_ids)
            
            # Count correct answers
            correct_responses = answered_responses.filter(booleaniscorrect=True)
            correct_question_ids = correct_responses.values_list('question_id', flat=True).distinct()
            correct_count = len(correct_question_ids)
            
            # Calculate percentages
            completion_percentage = (answered_count / total_questions) * 100 if total_questions > 0 else 0
            accuracy_percentage = (correct_count / answered_count) * 100 if answered_count > 0 else 0

            return Response({
                'answered_count': answered_count,
                'correct_count': correct_count,
                'total_questions': total_questions,
                'completion_percentage': completion_percentage,
                'accuracy_percentage': accuracy_percentage
            })
            
        except Theme.DoesNotExist:
            return Response({'error': f'Theme with id {theme_id} does not exist'}, status=404)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=500)

        
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

@api_view(['POST'])
def save_multiple_student_responses(request):

    student_id = request.data.get('student_id')
    responses = request.data.get('responses', [])
    
    if not student_id or not responses:
        return Response({
            'error': 'student_id e responses são obrigatórios'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        student_id = int(student_id)
        results = []
        new_responses = []
        updated_responses = []
        errors = []
        
        question_ids = [r.get('question_id') for r in responses if r.get('question_id')]
        existing_responses = StudentResponse.objects.filter(
            student_id=student_id,
            question_id__in=question_ids
        )
        
        existing_dict = {resp.question_id: resp for resp in existing_responses}
        
        for response_data in responses:
            question_id = response_data.get('question_id')
            response_text = response_data.get('response')
            is_correct = response_data.get('is_correct', False)
            
            if not question_id or not response_text:
                errors.append({
                    'question_id': question_id,
                    'error': 'question_id e response são obrigatórios para cada resposta'
                })
                continue
                
            try:
                question = Question.objects.get(id=question_id)
                
            except Question.DoesNotExist:
                errors.append({
                    'question_id': question_id,
                    'error': 'Questão não encontrada'
                })
                continue
            
            if question_id in existing_dict:
                existing = existing_dict[question_id]
                existing.response = response_text
                existing.booleaniscorrect = is_correct
                existing.save()
                updated_responses.append({
                    'question_id': question_id,
                    'response': response_text,
                    'booleaniscorrect': is_correct,
                    'status': 'updated'
                })
                
    
            else:
                new_response = StudentResponse.objects.create(
                    student_id=student_id,
                    question_id=question_id,
                    response=response_text,
                    booleaniscorrect=is_correct
                )
                new_responses.append({
                    'question_id': question_id,
                    'response': response_text,
                    'booleaniscorrect': is_correct,
                    'status': 'created'
                })
        
        return Response({
            'message': 'Processamento de respostas concluído',
            'created': len(new_responses),
            'updated': len(updated_responses),
            'errors': len(errors),
            'new_responses': new_responses,
            'updated_responses': updated_responses,
            'error_details': errors
        })
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)