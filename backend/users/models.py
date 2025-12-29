from django.db import models
from django.contrib.auth.models import AbstractUser
from core.models import TimeStampedModel

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
