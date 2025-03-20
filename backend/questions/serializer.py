from rest_framework import serializers 
from .models import Question

class QuestionSerializer(serializers.ModelSerializer):
    theme_name = serializers.CharField(source='theme.name', read_only=True)
    class Meta:
        model = Question
        fields = ['id', 'title', 'difficulty', 'theme_id', 'theme_name']

class QuestionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'title', 'difficulty'] 