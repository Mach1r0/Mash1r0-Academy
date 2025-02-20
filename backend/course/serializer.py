from rest_framework import serializers
from .models import Course

class CourseSerializer(serializers.Serializer):
    model = Course
    fields = '__all__'
