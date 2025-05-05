from rest_framework import serializers 
from .models import Question
from theme.models import Theme, SubTheme

class QuestionSerializer(serializers.ModelSerializer):
    theme_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Question
        fields = ['id', 'title', 'difficulty', 'theme', 'answer', 'explanation', 'subtheme', 'theme_name']
    
    def get_theme_name(self, obj):
        if obj.theme:
            return obj.theme.name
        return None

class QuestionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'title', 'difficulty']