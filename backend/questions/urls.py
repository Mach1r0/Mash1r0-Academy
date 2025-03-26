from django.url import path
from .views import QuestionViewSet

urlpatterns = [
    path('student/<int:id>', QuestionViewSet.as_view({'get': 'list', 'post': 'create'})),
]
