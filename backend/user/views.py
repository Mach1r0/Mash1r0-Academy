from django.shortcuts import render
from rest_framework import viewsets
from .models import User 
from .serializer import UserSerializer, LoginSerializer
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
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):  
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)  
        serializer.save()
        headers = self.get_success_headers(serializer.data) 
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class LoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True) 
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        username = serializer.validated_data.get('username')
        password = serializer.validated_data.get('password')

        user = authenticate(username=username, password=password)

        if user is None: 
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)
        acess = refresh.acess_token 

        user_data =  {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'username': user.username,
            'slug': user.slug,
            'picture': user.picture.url if user.picture else None  
        }

        return Response({
            'user': user_data,
            'acess': str(acess),
            'refresh': str(refresh)
        }, status=status.HTTP_200_OK)

