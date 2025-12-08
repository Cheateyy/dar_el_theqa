from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, ActivationView, UserDetailView, PartnerListView,
    AdminUserListView, AdminPartnerListView, AdminPartnerDetailView
)

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/activation/', ActivationView.as_view(), name='activation'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/user/', UserDetailView.as_view(), name='user_detail'),
    path('partners/', PartnerListView.as_view(), name='partner_list'),
    
    # Admin URLs
    path('admin/users/', AdminUserListView.as_view(), name='admin_user_list'),
    path('admin/partners/', AdminPartnerListView.as_view(), name='admin_partner_list'),
    path('admin/partners/<int:pk>/', AdminPartnerDetailView.as_view(), name='admin_partner_detail'),
]
