from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Partner

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'phone_number', 'role', 'is_active']
        read_only_fields = ['id', 'email', 'role', 'is_active']

class RegisterSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(write_only=True)
    re_password = serializers.CharField(write_only=True)
    accepted_terms = serializers.BooleanField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'phone_number', 'password', 're_password', 'full_name', 'accepted_terms']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['re_password']:
            raise serializers.ValidationError("Passwords do not match.")
        if not data.get('accepted_terms'):
            raise serializers.ValidationError("You must accept the terms.")
        return data

    def create(self, validated_data):
        full_name = validated_data.pop('full_name')
        validated_data.pop('re_password')
        validated_data.pop('accepted_terms')
        
        # Split full name logic (simple)
        names = full_name.split(' ', 1)
        first_name = names[0]
        last_name = names[1] if len(names) > 1 else ''
        
        user = User.objects.create_user(
            username=validated_data['email'],
            first_name=first_name,
            last_name=last_name,
            **validated_data
        )
        user.is_active = False # Require activation
        user.save()
        return user

class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = '__all__'
