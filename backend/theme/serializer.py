from rest_framework import serializers
from .models import Theme, SubTheme
from teacher.models import Teacher
from student.models import Student
from questions.serializer import QuestionSerializer

class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = ['id', 'name', 'description', 'created', 'modified']
        
class SubThemeSerializer(serializers.ModelSerializer):
    theme_name = serializers.CharField(source='theme.name', read_only=True)
    theme_id = serializers.PrimaryKeyRelatedField(source='theme', queryset=Theme.objects.all(), write_only=True)
    
    class Meta:
        model = SubTheme
        fields = ['id', 'name', 'description', 'theme_name', 'theme_id', 'created', 'modified']
        
    def create(self, validated_data):
        theme = validated_data.pop('theme')
        validated_data['theme'] = theme
        return super().create(validated_data)
        
    def update(self, instance, validated_data):
        if 'theme' in validated_data:
            theme = validated_data.pop('theme')
            validated_data['theme'] = theme
        return super().update(instance, validated_data)