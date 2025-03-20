from rest_framework import serializers
from .models import StudentResponse

class StudentReponseSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = StudentResponse
        fields = '__all__'