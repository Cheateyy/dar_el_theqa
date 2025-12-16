import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from listings.models import Listing
from users.models import User
from interactions.models import Review  # <-- adjust if app name is different


def get_reviewer() -> User:
    """Create a user who will write the review (or return existing one)."""
    email = "reviewer@example.com"

    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            "username": email,
            "first_name": "Amine",
            "last_name": "K",
            "role": User.Role.USER,
            "is_active": True,
        },
    )

    if created:
        user.set_unusable_password()
        user.save()

    return user


def add_review(listing_id: int):
    reviewer = get_reviewer()

    try:
        listing = Listing.objects.get(id=listing_id)
    except Listing.DoesNotExist:
        print(f"❌ Listing with ID {listing_id} does not exist.")
        return

    review = Review.objects.create(
        user=reviewer,
        listing=listing,
        rating=5,
        comment="Très bon appartement, très propre et bien situé.",
    )

    print(f"✅ Added review (ID={review.id}) for listing ID={listing_id}")


if __name__ == "__main__":
    add_review(1)
