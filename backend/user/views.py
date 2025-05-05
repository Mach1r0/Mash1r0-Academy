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
from django.db import IntegrityError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from student.models import Student  # Importe o modelo Student

User = get_user_model()

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
        except IntegrityError as e:
            error_msg = str(e).lower()
            print(f"Integrity error: {error_msg}")

            # Mapeamento de termos nos erros para mensagens amigáveis
            error_mapping = {
                "slug": "Este nome de usuário já está em uso. Por favor, escolha outro.",
                "email": "Este email já está em uso. Por favor, utilize outro.",
                "username": "Este nome de usuário já está em uso. Por favor, escolha outro."
            }
            
            for key, message in error_mapping.items():
                if key in error_msg:
                    return Response({"detail": message}, status=status.HTTP_400_BAD_REQUEST)
            
            return Response(
                {"detail": "Não foi possível criar o usuário devido a um conflito nos dados."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            print(f"Error saving user: {str(e)}")
            return Response(
                {"detail": "Ocorreu um erro ao criar o usuário. Por favor, tente novamente."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
                
@api_view(['POST'])
@permission_classes([AllowAny])
def LoginView(request):
    email = request.data.get('email', '')
    password = request.data.get('password', '')
    
    try:
        user = User.objects.get(email=email)
        
        if user.check_password(password):
            refresh = RefreshToken.for_user(user)
            access = refresh.access_token
            
            student_id = None
            try:
                student = Student.objects.get(user=user)
                student_id = student.id
            except Student.DoesNotExist:
                pass
                
            user_data = {
                'id': user.id,
                'username': user.username,
                'name': getattr(user, 'name', ''),
                'email': user.email, 
                'student_id': student_id, 
                'slug': getattr(user, 'slug', ''),
            }
            
            return Response({
                'refresh': str(refresh),
                'access': str(access),
                'user': user_data
            })
        else:
            return Response({'detail': 'Credenciais inválidas'}, status=400)
            
    except User.DoesNotExist:
        return Response({'detail': 'Usuário não encontrado'}, status=404)