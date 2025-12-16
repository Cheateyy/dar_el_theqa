import os
from decimal import Decimal
import django
from django.utils.text import slugify

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.contrib.auth import get_user_model

from listings.models import Listing, ListingImage, ListingDocument
from locations.models import Wilaya, Region

User = get_user_model()


def ensure_owner() -> User:
    """Create a lightweight owner for testing."""
    owner_email = os.environ.get("TEST_LISTING_OWNER_EMAIL", "test-owner@example.com")
    owner, created = User.objects.get_or_create(
        email=owner_email,
        defaults={
            "username": owner_email,
            "first_name": "Test",
            "last_name": "Owner",
            "role": User.Role.USER,
            "is_active": True,
        },
    )
    if created or not owner.has_usable_password():
        owner.set_password(os.environ.get("TEST_LISTING_OWNER_PASSWORD", "owner123"))
        owner.save()
    return owner


def ensure_location():
    """Ensure Wilaya + Region exist."""
    wilaya, _ = Wilaya.objects.get_or_create(name="Alger")
    region, _ = Region.objects.get_or_create(wilaya=wilaya, name="Hydra")
    return wilaya, region


def build_unique_slug(title: str) -> str:
    """Generate a unique slug."""
    base_slug = slugify(title) or "listing"
    slug = base_slug
    i = 1
    while Listing.objects.filter(slug=slug).exists():
        slug = f"{base_slug}-{i}"
        i += 1
    return slug


def create_dummy_images(listing: Listing):
    """Attach dummy image paths to the new listing."""
    if listing.images.exists():
        return

    dummy_paths = [
        "dummyPropertyImages/image1.jpg",
        "dummyPropertyImages/image2.jpg",
        "dummyPropertyImages/image3.jpg",
        "dummyPropertyImages/image4.jpg",
        "dummyPropertyImages/image5.jpg",
        "dummyPropertyImages/image6.jpg",
    ]

    for path in dummy_paths:
        ListingImage.objects.create(listing=listing, image=path)

    print(f"📸 Added {len(dummy_paths)} dummy images to listing #{listing.id}")


def create_dummy_documents(listing: Listing):
    """Create PENDING documents for admin testing."""
    if listing.documents.exists():
        return

    documents = [
        (ListingDocument.DocumentType.IDENTITY, ListingDocument.Status.PENDING, ""),
        (ListingDocument.DocumentType.OWNERSHIP, ListingDocument.Status.PENDING, ""),
        (ListingDocument.DocumentType.REGISTER, ListingDocument.Status.PENDING, ""),
    ]

    for doc_type, status, note in documents:
        ListingDocument.objects.create(
            listing=listing,
            document_type=doc_type,
            file=f"documents/{doc_type.lower()}_{listing.id}.pdf",
            status=status,
            admin_note=note,
        )

    print(f"📄 Added {len(documents)} PENDING documents to listing #{listing.id}")


def create_test_listing() -> Listing:
    owner = ensure_owner()
    wilaya, region = ensure_location()

    title = "Test Apartment F3"

    listing = Listing.objects.create(
        owner=owner,
        title=title,
        slug=build_unique_slug(title),
        description="This is a test listing created via script.",
        transaction_type=Listing.TransactionType.BUY,
        property_type=Listing.PropertyType.APARTMENT,
        price=Decimal("250000.00"),
        rent_unit=Listing.RentUnit.MONTH,
        wilaya=wilaya,
        region=region,
        address="123 Test Street, Hydra, Alger",
        area=90,
        bedrooms=3,
        bathrooms=1,
        floors=2,

        # ✔ Listing starts pending
        status=Listing.Status.PENDING,

        # ✔ IMPORTANT: Use enum NONE instead of NULL (DB does not allow NULL)
        verification_status=Listing.VerificationStatus.NONE,

        rental_status=Listing.RentalStatus.AVAILABLE,
    )

    create_dummy_images(listing)
    create_dummy_documents(listing)

    return listing


if __name__ == "__main__":
    listing = create_test_listing()
    print(f"✅ Created test listing with ID = {listing.id} and slug = {listing.slug}")
