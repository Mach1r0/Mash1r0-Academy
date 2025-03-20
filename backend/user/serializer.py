from rest_framework import serializers, status
from .models import User
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'role', 'name', 'email', 'username', 'password', 'slug', 'created_at', 'updated_at', ]
        read_only_fields = ['role']  
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            instance.set_password(validated_data.pop('password'))
        return super().update(instance, validated_data)

class RegisterSerializer(serializers.ModelSerializer): 
    email =  serializers.EmailField(required=True)
    username = serializers.CharField(required=True) 
    password = serializers.CharField(required=True, validators=[validate_password])
    name = serializers.CharField(required=True)

    class Meta: 
        model = User 
        fields =  [ 'name', 'email', 'username', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, attrs):
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({'email': 'Email is already in use'})
    
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({'username': 'Username is already in use'})
        
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            name=validated_data['name'],
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True, write_only=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            raise serializers.ValidationError("Email and password are required")
        
        user = User.objects.filter(email=email).first()
        if not user:
            raise serializers.ValidationError("Email is not valid")

        if not user.check_password(password):
            raise serializers.ValidationError("Password is not valid")

        return data
