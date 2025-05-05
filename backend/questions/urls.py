from django.urls import path  
from .views import QuestionViewSet, QuestionsByThemeViewSet, QuestionsBySubThemeViewSet

urlpatterns = [
    path('student/<int:id>/', QuestionViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('by-theme/<int:theme_id>/', QuestionsByThemeViewSet.as_view({'get': 'list'})),
    path('by-subtheme/<int:subtheme_id>/', QuestionsBySubThemeViewSet.as_view({'get': 'list'})), 
]