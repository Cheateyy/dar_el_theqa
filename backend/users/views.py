from rest_framework import generics, status, views, permissions
from rest_framework.response import Response
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    PartnerSerializer,
    ActivationResendSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
)
from .models import Partner
import random

User = get_user_model()

class RegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Mock OTP generation
            otp = random.randint(100000, 999999)
            print(f"OTP for {user.email}: {otp}") # Console print as requested
            # In real app, save OTP to DB/Cache
            return Response({
                "id": user.id,
                "email": user.email,
                "full_name": user.get_full_name(),
                "message": "User created. Please check your email for the activation code."
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ActivationView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')
        # Mock verification
        try:
            user = User.objects.get(email=email)
            user.is_active = True
            user.save()
            
            refresh = RefreshToken.for_user(user)
            return Response({
                "status": "success",
                "message": "Account activated.",
                "token": str(refresh.access_token),
                "user": {"id": user.id, "name": user.get_full_name()}
            })
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class ActivationResendView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ActivationResendSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email)
            if not user.is_active:
                otp = random.randint(100000, 999999)
                print(f"Activation resend OTP for {email}: {otp}")
        except User.DoesNotExist:
            pass

        return Response({
            "status": "success",
            "message": "A new activation code has been sent to your email.",
        })

class UserDetailView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            return Response({
                "isAuthenticated": True,
                "user": {
                    "id": request.user.id,
                    "name": request.user.get_full_name(),
                    "email": request.user.email,
                    "role": request.user.role,
                    "is_staff": request.user.is_staff
                }
            })
        return Response({"isAuthenticated": False})


class PasswordResetRequestView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({
                "status": "success",
                "message": "If an account exists with this email, a reset link has been sent.",
            })

        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        base_url = getattr(settings, 'FRONTEND_RESET_PASSWORD_URL', 'https://daretheqa.dz/reset-password')
        reset_url = f"{base_url.rstrip('/')}/{uid}/{token}"
        print(f"Password reset link for {email}: {reset_url}")

        return Response({
            "status": "success",
            "message": "If an account exists with this email, a reset link has been sent.",
        })


class PasswordResetConfirmView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        uid = serializer.validated_data['uid']
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            return Response({
                "status": "error",
                "message": "Invalid reset link.",
            }, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({
                "status": "error",
                "message": "Invalid or expired token.",
            }, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({
            "status": "success",
            "message": "Password reset successfully. You can now login.",
        })

class PartnerListView(generics.ListAPIView):
    queryset = Partner.objects.all()
    serializer_class = PartnerSerializer
    permission_classes = [permissions.AllowAny]

# Admin Views
class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminPartnerListView(generics.ListCreateAPIView):
    queryset = Partner.objects.all()
    serializer_class = PartnerSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminPartnerDetailView(generics.RetrieveDestroyAPIView):
    queryset = Partner.objects.all()
    serializer_class = PartnerSerializer
    permission_classes = [permissions.IsAdminUser]
