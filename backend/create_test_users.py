# create_test_users.py
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Create test users with correct field names
users_data = [
    {
        'email': 'admin@test.com',
        'username': 'admin',
        'first_name': 'Admin',
        'last_name': 'User',
        'phone_number': '+213561304777',
        'password': 'admin123',
        'role': 'ADMIN',
        'is_staff': True,
        'is_superuser': True,
    },
    {
        'email': 'partner@test.com',
        'username': 'partner',
        'first_name': 'Partner',
        'last_name': 'User',
        'phone_number': '+213555123456',
        'password': 'partner123',
        'role': 'PARTNER',
        'is_staff': False,
        'is_superuser': False,
    },
    {
        'email': 'user@test.com',
        'username': 'testuser',
        'first_name': 'Regular',
        'last_name': 'User',
        'phone_number': '+213777654321',
        'password': 'user123',
        'role': 'USER',
        'is_staff': False,
        'is_superuser': False,
    },
]

print("Creating test users...")
print("-" * 50)

for user_data in users_data:
    password = user_data.pop('password')
    email = user_data['email']
    
    # Check if user already exists
    if User.objects.filter(email=email).exists():
        print(f"✗ User already exists: {email}")
        continue
    
    # Create user
    try:
        user = User.objects.create(**user_data)
        user.set_password(password)
        user.is_active = True  # Skip email verification for testing
        user.save()
        print(f"✓ Created: {email} (role: {user.role})")
    except Exception as e:
        print(f"✗ Error creating {email}: {e}")

print("-" * 50)
print("\n=== Test Users Ready ===")
print("Admin:   admin@test.com   / admin123")
print("Partner: partner@test.com / partner123")
print("User:    user@test.com    / user123")
print("\nYou can now test login at: http://localhost:5173/login")