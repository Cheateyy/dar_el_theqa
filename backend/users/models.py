from django.db import models
from django.db.models import Q
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
    partner = models.OneToOneField(
        'users.Partner',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='user',
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        # Backend-only linking: if a user is a PARTNER, ensure they are linked
        # to a Partner row (prefer matching by email/phone; otherwise create).
        if self.role != User.Role.PARTNER or self.partner_id is not None:
            return

        partner = Partner.objects.filter(user__isnull=True).filter(
            Q(email__iexact=self.email)
            | (Q(phone_number__isnull=False) & Q(phone_number=self.phone_number))
        ).first()

        if partner is None:
            company_name = (self.get_full_name() or '').strip() or self.email
            partner = Partner.objects.create(
                company_name=company_name,
                email=self.email,
                phone_number=self.phone_number,
            )

        # Avoid recursion by updating through queryset.
        type(self).objects.filter(pk=self.pk, partner__isnull=True).update(partner=partner)
        self.partner_id = partner.pk

class Partner(TimeStampedModel):
    company_name = models.CharField(max_length=255)
    email = models.EmailField(null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    wilaya = models.ForeignKey('locations.Wilaya', on_delete=models.SET_NULL, null=True, related_name='partners')
    region = models.ForeignKey('locations.Region', on_delete=models.SET_NULL, null=True, blank=True, related_name='partners')
    listing_address = models.TextField(null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    logo = models.ImageField(upload_to='partners/logos/', null=True, blank=True)

    def __str__(self):
        return self.company_name
