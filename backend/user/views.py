from django.shortcuts import render
from rest_framework import viewsets
from .models import User 
from .serializer import UserSerializer, RegisterSerializer, LoginSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, get_user_model
import logging, datetime
from rest_framework_simplejwt.tokens import RefreshToken


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class RegisterUser(APIView):
    serializer_class = RegisterSerializer  
    
    def post(self, request, *args, **kwargs):  
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()  
        
        response_data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "name": user.name
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)
    
    def get_success_headers(self, data):
        try:
            return {'Location': data.get('id')}
        except (TypeError, KeyError):
            return {}
        

class LoginView(APIView):
    authentication_classes = []  
    permission_classes = [] 

    def post(self, request):
        print("Received data:", request.data)  
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            print("Serializer errors:", serializer.errors)  
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = authenticate(username=username, password=password)

        if user is None:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        user_data = {
            'id': user.id,
            'username': user.username,
            'name': user.name,
            'email': user.email,
            'slug': user.slug,
            'picture': user.picture.url if user.picture else None  
        }
        
        return Response({
            'refresh': str(refresh),
            'access': str(access),
            'user': user_data
        }, status=status.HTTP_200_OK)

