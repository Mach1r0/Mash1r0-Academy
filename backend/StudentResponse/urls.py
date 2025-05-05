from django.urls import path
from .views import ProgressThemeProgressViewSet, ProgressSubThemeViewSet, student_answered_questions

urlpatterns = [
    path('theme-progress/', ProgressThemeProgressViewSet.as_view({'get': 'theme_progress'}), name='theme_progress'),
    path('subtheme-progress/', ProgressSubThemeViewSet.as_view({'get': 'subtheme_progress'}), name='subtheme_progress'), 
    path('answered-questions/', student_answered_questions, name='student_answered_questions')
]