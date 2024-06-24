from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from accounts.models import User,UserProfile
from .serializers import UserRegisterSerializer,MyTokenObtainPairSerializer,UserSerializer,UserImageDetailsUpdateSerializer,UserProfileSerializer,AdminUserSerializer
from rest_framework.generics import ListCreateAPIView

from rest_framework.exceptions import AuthenticationFailed,ParseError
from django.contrib.auth import authenticate

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import serializers
from rest_framework.parsers import MultiPartParser, FormParser

from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import SearchFilter
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status, permissions
from .permissions import IsAdmin

from rest_framework.generics import RetrieveAPIView
from rest_framework.generics import UpdateAPIView
from .serializers import UserUpdateSerializer, UserDetailsUpdateSerializer

class getAccountsRoutes(APIView):
     def get(self, request, format=None):
        routes = [
        'api/accounts/login',
        'api/accounts/register',
                    ]
        return Response(routes)

class RegisterView(APIView):
    def post(self,request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors,status=status.HTTP_406_NOT_ACCEPTABLE,)  
        # serializer.is_valid(raise_exception=True)
        # serializer.save()
        
        content ={'Message':'User Registered Successfully'}
        return Response(content,status=status.HTTP_201_CREATED,)


class CheckUserView(APIView):
    def post(self, request):
        phone_number = request.data.get('phone_number')
        if not phone_number:
            return Response({'error': 'Phone number is required'}, status=400)

        user_exists = User.objects.filter(phone_number=phone_number).exists()
        return Response({'user_exists': user_exists})


import requests
import random
from django.conf import settings

class SendOTPView(APIView):
    def post(self,request):
        
        phone_number = request.data['phone_number']
        first_name = request.data.get('first_name')

        if not phone_number:
            return Response({'error': 'Phone number is required'}, status=400)  
   
        user, created = User.objects.get_or_create(phone_number=phone_number)
        if created:
            # New user, generate OTP and save to the user instance
            user.first_name = first_name
            user.otp_code = ''.join(random.choices('0123456789', k=6))
            user.save()
        else:
            # Existing user, generate new OTP
            user.otp_code = ''.join(random.choices('0123456789', k=6))
            user.save()
        
        # if not User.objects.filter(email=email,is_active=True).exists():
        #     raise AuthenticationFailed('You are blocked by admin ! Please contact admin')
        
        message_sent = self.send_otp(user.phone_number, user.otp_code)

        if message_sent:
            return Response({'message': 'OTP sent successfully.'})
        else:
            return Response({'error': 'Failed to send OTP.'}, status=500)


    def send_otp(self, mobile, otp):
        """
        Send OTP message.
        """
        url = f"https://2factor.in/API/V1/{settings.SMS_API_KEY}/SMS/{mobile}/{otp}"
        payload = ""
        headers = {'content-type': 'application/x-www-form-urlencoded'}
        response = requests.get(url, data=payload, headers=headers)
        return response.ok    




class VerifyOTPView(APIView):

    def post(self, request):
        phone_number = request.data['phone_number']
        otp_code = request.data['otp_code']
        user = User.objects.filter(phone_number=phone_number).first()
        if not user:
            raise serializers.ValidationError('Phone number not found.')

        if otp_code != user.otp_code:
            raise serializers.ValidationError('Invalid OTP code.')

        user.is_active = True
        user.save()
        refresh = RefreshToken.for_user(user)
        refresh["first_name"] = str(user.first_name)
        content = {
                     'refresh': str(refresh),
                     'access': str(refresh.access_token),
                     'isAdmin':user.is_superuser,
                }
        
        return Response(content,status=status.HTTP_200_OK)
    
    
class LogoutView(APIView):
    permission_classes = (AllowAny,)
    authentication_classes = ()

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)    



class AdminLoginView(APIView):
    def post(self,request):
        phone_number=request.data['phone_number']
        password=request.data['password']

        user=authenticate(username=phone_number,password=password)

        if user.is_superuser:
            refresh = RefreshToken.for_user(user)
            refresh['username'] = str(user.first_name)

            access_token = refresh.access_token
            refresh_token = str(refresh)

            content = {
                'access_token': str(access_token),
                'refresh_token': refresh_token,
                'isAdmin': user.is_superuser,
            }
        elif user.is_staff:
            return Response({'This account is not a Superuser account'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(content, status=status.HTTP_200_OK)
    

class AdminDashboardCount(APIView):
    permission_classes = [IsAdmin]
    def get(self,request):
        user_count=User.objects.filter(is_staff=False,is_superuser=False).count()
        bolcked_users=User.objects.filter(is_staff=False,is_superuser=False,is_active=False).count()
        data={
            'user':user_count,
            'buser':bolcked_users,
        }
        print(data)
        return Response(data,status=status.HTTP_200_OK)


class UserView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        userEmail = User.objects.get(id=request.user.id).email
        content = {
            'user-email':userEmail,
            'user': str(request.user),  # `django.contrib.auth.User` instance.
            'auth': str(request.auth),  # None
        }
        return Response(content)
    
from match.models import MatchTeamPlayer

class UserDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = User.objects.get(id=request.user.id)
        data = UserSerializer(user).data

        try:
            profile_pic = user.User_Profile.profile_pic
            data['profile_pic'] = request.build_absolute_uri('/')[:-1] + profile_pic.url
        except:
            data['profile_pic'] = ''

        # Get teams the user has played for
        match_team_players = MatchTeamPlayer.objects.filter(player_id=user)
        teams = {mtp.team_id for mtp in match_team_players}
        teams_data = [{'team_name': team.team_name, 'home_ground': team.home_ground} for team in teams]
        data['teams'] = teams_data

        return Response(data)
    
    
class UserImageDetailsUpdate(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        user_profile = UserProfile.objects.get_or_create(user=request.user)[0]
   
        user_image_update_details_serializer = UserImageDetailsUpdateSerializer(
            user_profile, data=request.data, partial=True
        )
        if user_image_update_details_serializer.is_valid():
            user_image_update_details_serializer.save()
            return Response(user_image_update_details_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', user_image_update_details_serializer.errors)
            return Response(user_image_update_details_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailsUpdate(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser,)

    def post(self, request, *args, **kwargs):
        user_profile = User.objects.get(id=request.user.id)
        serializer = UserDetailsUpdateSerializer(user_profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
###################### ADMIN SIDE ####################

class AdminUserListCreateView(ListCreateAPIView):
    permission_classes = [IsAdmin]
    queryset = User.objects.all().order_by('-date_joined')  
    serializer_class = UserSerializer
    filter_backends = [SearchFilter]
    search_fields = ['first_name',  'phone_number']     

class AdminUserRetrieveView(RetrieveAPIView):
    permission_classes = [IsAdmin]
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    lookup_field = 'id'

from django.shortcuts import get_object_or_404    
    
class AcceptUserView(APIView):
    permission_classes = [IsAdmin]
    def patch(self, request, pk, *args, **kwargs):
        user = get_object_or_404(User, pk=pk)

        if 'is_email_verified' in request.data:
            user.is_email_verified = True
            UserProfile.objects.get_or_create(user=user)

        elif 'is_active' in request.data:
            user.is_active = request.data['is_active']

        user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
        