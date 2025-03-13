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
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authtoken.models import Token

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class RegisterUser(APIView):
    serializer_class = RegisterSerializer  
    
    def post(self, request, *args, **kwargs): 
        serializer = self.serializer_class(data=request.data)
        
        if not serializer.is_valid():
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = serializer.save()
            
            response_data = {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "name": user.name
            }
            
            return Response(response_data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Error saving user: {str(e)}")
            return Response(
                {"detail": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class LoginView(APIView):
    authentication_classes = []  
    permission_classes = [] 

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            print("Serializer errors:", serializer.errors)  
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            user = User.objects.get(email=email)
            
            if user.check_password(password):
                refresh = RefreshToken.for_user(user)
                access = refresh.access_token
                
                user_data = {
                    'id': user.id,
                    'username': user.username,
                    'name': getattr(user, 'name', ''),
                    'email': user.email
                }
                
                if hasattr(user, 'slug'):
                    user_data['slug'] = user.slug
                
                if hasattr(user, 'picture') and user.picture:
                    try:
                        user_data['picture'] = user.picture.url
                    except:
                        user_data['picture'] = None
                
                return Response({
                    'refresh': str(refresh),
                    'access': str(access),
                    'user': user_data
                }, status=status.HTTP_200_OK)
            else:
                print(f"Password verification failed for user {email}")
                return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        except User.DoesNotExist:
            print(f"User {email} not found")
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            print(f"Error during login: {str(e)}")
            return Response({'detail': 'An error occurred during login'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)