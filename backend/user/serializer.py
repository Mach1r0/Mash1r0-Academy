from rest_framework import serializers
from .models import User
from rest_framework.authtoken.models import Token

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
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            raise serializers.ValidationError('A username and password is required to login')
        
        if not User.objects.filter(username=username).exists():
            raise serializers.ValidationError('User not found')
        
        user = User.objects.get(username=username)

        if user and not user.check_password(password):
            raise serializers.ValidationError('Incorrect password')
        
        return data 
    
    def save(self,  **kwargs):
        username = self.validated_data.get['username']
        user = User.objects.get(username=username)
        token, created = Token.objects.get_or_create(user=user)

        return {
            'token': token.key, 
            'user_id': user.pk, 
            'username': user.username
        }