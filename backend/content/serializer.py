from rest_framework import serializers 
from .models import Content 

class ContentSerializer(serializers.Serializer):
    class Meta:
        model = Content
        fields = '__all__'
        
