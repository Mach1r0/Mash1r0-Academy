from rest_framework import serializers
from .models import User
from rest_framework.authtoken.models import Token
from django.contrib.auth.password_validation import validate_password
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'username', 'password', 'slug', 'created_at', 'updated_at', 'is_staff', 'role', 'groups', 'user_permissions']
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
    username = serializers.CharField(required=True, write_only=True)
    password = serializers.CharField(required=True, write_only=True)
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            raise serializers.ValidationError("username and password are required")
        
        if not User.objects.filter(username=username).exists():
            raise serializers.ValidationError("username is not valid")
        
        user = User.objects.filter(username=username).first()
        if user and not user.check_password(password):
            raise serializers.ValidationError("Password is not valid")
        
        return data
    
    def save(self, **kwargs):
        username = self.validated_data['username']
        user = User.objects.get(username=username)
        token, created = Token.objects.get_or_create(user=user)
        return {
            'token': token.key,
            'user_id': user.pk,
            'username': user.username
        }