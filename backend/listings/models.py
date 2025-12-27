from django.db import models
from django.utils.crypto import get_random_string
from django.utils.text import slugify
from core.models import TimeStampedModel

class Listing(TimeStampedModel):
    class TransactionType(models.TextChoices):
        BUY = 'BUY', 'Buy'
        RENT = 'RENT', 'Rent'

    class PropertyType(models.TextChoices):
        APARTMENT = 'APARTMENT', 'Apartment'
        VILLA = 'VILLA', 'Villa'
        LAND = 'LAND', 'Land'
        STUDIO = 'STUDIO', 'Studio'
        OFFICE = 'OFFICE', 'Office'
        SHOP = 'SHOP', 'Shop'
        WAREHOUSE = 'WAREHOUSE', 'Warehouse'

    class RentUnit(models.TextChoices):
        MONTH = 'MONTH', 'Month'
        DAY = 'DAY', 'Day'
        YEAR = 'YEAR', 'Year'

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'
        INACTIVE = 'INACTIVE', 'Inactive'
        RENTED = 'RENTED', 'Rented'
        APPROVED_AND_PENDING = 'APPROVED_AND_PENDING', 'Approved and Pending'

    class VerificationStatus(models.TextChoices):
        NONE = 'NONE', 'None'
        PARTIAL = 'PARTIAL', 'Partial'
        VERIFIED = 'VERIFIED', 'Verified'

    class RentalStatus(models.TextChoices):
        AVAILABLE = 'AVAILABLE', 'Available'
        RENTED = 'RENTED', 'Rented'

    owner = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='listings')
    partner = models.ForeignKey('users.Partner', on_delete=models.SET_NULL, null=True, blank=True, related_name='listings')
    
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, db_index=True)
    description = models.TextField()
    
    transaction_type = models.CharField(max_length=10, choices=TransactionType.choices, db_index=True)
    property_type = models.CharField(max_length=20, choices=PropertyType.choices, db_index=True)
    
    price = models.DecimalField(max_digits=14, decimal_places=2)
    rent_unit = models.CharField(max_length=10, choices=RentUnit.choices, null=True, blank=True)
    
    wilaya = models.ForeignKey('locations.Wilaya', on_delete=models.PROTECT, related_name='listings')
    region = models.ForeignKey('locations.Region', on_delete=models.PROTECT, related_name='listings')
    address = models.TextField()
    
    area = models.IntegerField()
    bedrooms = models.IntegerField()
    bathrooms = models.IntegerField()
    floors = models.IntegerField()
    
    status = models.CharField(max_length=25, choices=Status.choices, default=Status.PENDING, db_index=True)
    verification_status = models.CharField(max_length=10, choices=VerificationStatus.choices, default=VerificationStatus.NONE)
    rejection_reason = models.TextField(null=True, blank=True)
    
    rental_status = models.CharField(max_length=10, choices=RentalStatus.choices, default=RentalStatus.AVAILABLE)
    available_date = models.DateField(null=True, blank=True)

    # Stores per-document notes (e.g. reasons a required document is missing)
    # Example: {"docidentity": "will upload later", "docregister": "pending"}
    document_notes = models.JSONField(default=dict, blank=True)

    def save(self, *args, **kwargs):
        # Enforce a unique, non-empty slug even if some caller forgets to set it.
        if not self.slug:
            base_slug = slugify(self.title or '') or 'listing'
            candidate = base_slug
            while Listing.objects.exclude(pk=self.pk).filter(slug=candidate).exists():
                candidate = f"{base_slug}-{get_random_string(6)}"
            self.slug = candidate

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class ListingImage(TimeStampedModel):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='listings/images/')
    label = models.CharField(max_length=255, null=True, blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

class ListingDocument(TimeStampedModel):
    class DocumentType(models.TextChoices):
        IDENTITY = 'IDENTITY', 'Identity'
        OWNERSHIP = 'OWNERSHIP', 'Ownership'
        ASSURANCE = 'ASSURANCE', 'Assurance'
        REGISTER = 'REGISTER', 'Register'
        SILBIYA = 'SILBIYA', 'Silbiya'

    class Status(models.TextChoices):
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'
        #added the pending status which would be the default before any review
        PENDING = 'PENDING', 'Pending'

    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=20, choices=DocumentType.choices)
    file = models.FileField(upload_to='listings/documents/')
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING ,null=True, blank=True)
    admin_note = models.TextField(null=True, blank=True)
    #added owner note to justify and stuff
    owner_note = models.TextField(null=True, blank=True)
