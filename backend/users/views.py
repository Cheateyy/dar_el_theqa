from rest_framework import generics, status, views, permissions
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, RegisterSerializer, PartnerSerializer
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
