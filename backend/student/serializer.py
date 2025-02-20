from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.Serializer):
    model = Student
    fields = '__all__'