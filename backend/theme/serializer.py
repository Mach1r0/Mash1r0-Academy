from rest_framework import serializers
from .models import Theme, SubTheme
from teacher.models import Teacher
from student.models import Student
from questions.serializer import QuestionSerializer


    
class SubThemeSerializer(serializers.ModelSerializer):
    theme_name = serializers.CharField(source='theme.name', read_only=True)
    theme_id = serializers.PrimaryKeyRelatedField(source='theme', queryset=Theme.objects.all(), write_only=True)
    questions_count = serializers.SerializerMethodField()  
    
    class Meta:
        model = SubTheme
        fields = ['id', 'name', 'description', 'theme_name', 'theme_id', 'created', 'modified', 'questions_count', 'slug'] 
    
    def get_questions_count(self, obj): 
        return obj.questions.count()
    
    def create(self, validated_data):
        theme = validated_data.pop('theme')
        validated_data['theme'] = theme
        return super().create(validated_data)
        
    def update(self, instance, validated_data):
        if 'theme' in validated_data:
            theme = validated_data.pop('theme')
            validated_data['theme'] = theme
        return super().update(instance, validated_data)
    
class ThemeSerializer(serializers.ModelSerializer):
    questions_count = serializers.SerializerMethodField()
    subthemes_count = serializers.SerializerMethodField()  
    subthemes = SubThemeSerializer(many=True, read_only=True)  
    class Meta:
        model = Theme
        fields = ['id', 'name', 'description', 'created', 'modified', 'questions_count', 'subthemes_count', 'subthemes', 'slug']  
    
    def get_questions_count(self, obj):
        return obj.questions.count()

    def get_subthemes_count(self, obj):
        return obj.subthemes.count()
    
    def get_subthemes_list(self, obj):
        return obj.subthemes.all()