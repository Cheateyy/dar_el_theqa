from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Partner

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'phone_number', 'role', 'is_active']
        read_only_fields = ['id', 'email', 'role', 'is_active']


class AdminUserStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'is_active']
        read_only_fields = ['id', 'email', 'role']

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


class ActivationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField()


class ActivationResendSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    re_new_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['re_new_password']:
            raise serializers.ValidationError("Passwords do not match.")
        validate_password(attrs['new_password'])
        return attrs


class PartnerSerializer(serializers.ModelSerializer):
    # Backward-compatible aliases for existing frontend payloads
    name = serializers.CharField(source='company_name', required=False, write_only=True)
    address = serializers.CharField(source='listing_address', required=False, write_only=True)

    # Backward-compatible aliases for existing frontend reads
    legacy_name = serializers.CharField(source='company_name', read_only=True)
    legacy_address = serializers.CharField(source='listing_address', read_only=True)

    class Meta:
        model = Partner
        fields = [
            'id',
            'company_name',
            'email',
            'phone_number',
            'wilaya',
            'region',
            'listing_address',
            'website',
            'logo',
            # aliases
            'name',
            'address',
            'legacy_name',
            'legacy_address',
        ]
        extra_kwargs = {
            'company_name': {'required': True},
            'email': {'required': True},
            'phone_number': {'required': True},
            'wilaya': {'required': True},
            'region': {'required': True},
            'listing_address': {'required': True},
            'website': {'required': False, 'allow_null': True},
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Keep existing frontend reads working (expects `name`/`address`)
        data.setdefault('name', data.get('company_name'))
        data.setdefault('address', data.get('listing_address'))
        return data
