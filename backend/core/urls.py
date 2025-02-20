from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from user.views import UserViewSet
from student.views import StudentViewSet
from teacher.views import TeacherViewSet
from classroom.views import ClassViewSet  

router = routers.DefaultRouter()
router.register('user', UserViewSet)
router.register('student', StudentViewSet)
router.register('teacher', TeacherViewSet)
router.register('class', ClassViewSet)

urlpatterns = [
    path('', include(router.urls)),  
    path('admin/', admin.site.urls),
]