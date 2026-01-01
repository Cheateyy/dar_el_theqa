# create_test_leads.py

import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from users.models import User
from listings.models import Listing
from interactions.models import Lead  # adjust app name if needed
from locations.models import Wilaya, Region


def run():
    print("🔍 Looking for admin user...")
    admin = User.objects.get(email="admin@test.com")
    print(f"✅ Admin found: {admin.email}")

    print("🔍 Creating client user...")
    client, _ = User.objects.get_or_create(
        email="client@test.com",
        defaults={
            "username": "client2",
            "first_name": "Alice2",
            "last_name": "Smith",
            "role": User.Role.USER,
            "phone_number": "0555306217",
            "is_active": True,
        },
    )
    print(f"✅ Client user ready: {client.email}")

    print("📍 Getting wilaya & region...")
    wilaya = Wilaya.objects.first()
    region = Region.objects.filter(wilaya=wilaya).first()

    print("🏠 Creating listing...")
    listing, _ = Listing.objects.get_or_create(
        title="Test Listing",
        defaults={
            "transaction_type": "BUY",
            "property_type": "VILLA",
            "price": 200000,
            "wilaya": wilaya,
            "region": region,
            "address": "Test address",
            "area": 250,
            "bedrooms": 4,
            "bathrooms": 3,
            "floors": 2,
            "description": "Test listing description",
            "owner": admin,          
            "partner": admin.partner 
        },
    )
    print(f"✅ Listing ready: {listing.title}")

    print("📨 Creating leads...")
    Lead.objects.create(
        user=client,
        listing=listing,
        message="Is this property still available?",
    )

    print(" SUCCESS: Test leads created!")


if __name__ == "__main__":
    run()
