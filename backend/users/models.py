from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from core.models import TimeStampedModel

import random
from datetime import timedelta

class User(AbstractUser, TimeStampedModel):
    class Role(models.TextChoices):
        USER = 'USER', 'User'
        PARTNER = 'PARTNER', 'Partner'
        ADMIN = 'ADMIN', 'Admin'

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.USER, db_index=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    is_active = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

class Partner(TimeStampedModel):
    company_name = models.CharField(max_length=255)
    email = models.EmailField(null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    wilaya = models.ForeignKey('locations.Wilaya', on_delete=models.SET_NULL, null=True, related_name='partners')
    region = models.ForeignKey('locations.Region', on_delete=models.SET_NULL, null=True, blank=True, related_name='partners')
    listing_address = models.TextField(null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    logo = models.ImageField(upload_to='partners/logos/')

    def __str__(self):
        return self.company_name


class ActivationOTP(TimeStampedModel):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='activation_otps')
    code = models.CharField(max_length=6, db_index=True)
    expires_at = models.DateTimeField(db_index=True)
    used_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    @classmethod
    def create_for_user(cls, user, *, ttl_minutes: int = 10) -> 'ActivationOTP':
        code = f"{random.randint(0, 999999):06d}"
        expires_at = timezone.now() + timedelta(minutes=ttl_minutes)
        return cls.objects.create(user=user, code=code, expires_at=expires_at)

    def is_expired(self) -> bool:
        return timezone.now() >= self.expires_at

    def mark_used(self) -> None:
        if self.used_at is None:
            self.used_at = timezone.now()
            self.save(update_fields=['used_at'])
