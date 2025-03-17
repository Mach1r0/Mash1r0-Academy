from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from user.views import UserViewSet
from student.views import StudentViewSet
from teacher.views import TeacherViewSet
from classroom.views import ClassViewSet  
from theme.views import ThemeViewSet, SubThemeViewSet
from content.views import ContentViewSet
from questions.views import QuestionViewSet
from StudentResponse.views import StudentResponseViewSet
from django.conf import settings  
from django.conf.urls.static import static


router = routers.DefaultRouter()
router.register('user', UserViewSet)
router.register('student', StudentViewSet)
router.register('teacher', TeacherViewSet)
router.register('class', ClassViewSet)
router.register('theme', ThemeViewSet)
router.register('content', ContentViewSet)
router.register('question', QuestionViewSet)
router.register('studentresponse', StudentResponseViewSet)
router.register('subtheme', SubThemeViewSet, basename='subtheme')

urlpatterns = [
    path('', include(router.urls)),  
    path('admin/', admin.site.urls),
    path('api/user/', include('user.urls')),  
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)