#!/usr/bin/env python
"""
Script to create sample data for development/testing.
Run with: python manage.py shell < scripts/create_sample_data.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User, UserProfile
from apps.artists.models import Artist, ArtistPortfolio
from apps.commissions.models import Commission, CommissionCategory
from apps.payments.models import Payment, PaymentMethod
from apps.notifications.models import Notification

print("Creating sample data...")

# Create admin user
admin, created = User.objects.get_or_create(
    email='admin@example.com',
    defaults={
        'username': 'admin',
        'first_name': 'Admin',
        'last_name': 'User',
        'role': 'admin',
        'is_staff': True,
        'is_superuser': True,
    }
)
if created:
    admin.set_password('admin123')
    admin.save()
    print("Created admin user: admin@example.com / admin123")

# Create sample categories
categories = ['Digital Art', 'Traditional Art', 'Character Design', 'Illustration', 'Animation']
for cat_name in categories:
    CommissionCategory.objects.get_or_create(name=cat_name)
print(f"Created {len(categories)} categories")

# Create sample artists
for i in range(3):
    user, created = User.objects.get_or_create(
        email=f'artist{i+1}@example.com',
        defaults={
            'username': f'artist{i+1}',
            'first_name': f'Artist',
            'last_name': f'{i+1}',
            'role': 'artist',
        }
    )
    if created:
        user.set_password('password123')
        user.save()
        
        Artist.objects.get_or_create(
            user=user,
            defaults={
                'display_name': f'Artist {i+1}',
                'specialty': categories[i % len(categories)],
                'description': f'Professional artist specializing in {categories[i % len(categories)]}',
                'minimum_price': 50 + (i * 25),
                'maximum_price': 200 + (i * 50),
                'turnaround_days': 7 + i,
                'status': 'approved',
                'is_accepting_commissions': True,
                'rating': 4.0 + (i * 0.3),
            }
        )
print("Created 3 sample artists")

# Create sample clients
for i in range(2):
    user, created = User.objects.get_or_create(
        email=f'client{i+1}@example.com',
        defaults={
            'username': f'client{i+1}',
            'first_name': f'Client',
            'last_name': f'{i+1}',
            'role': 'client',
        }
    )
    if created:
        user.set_password('password123')
        user.save()
print("Created 2 sample clients")

print("Sample data creation completed!")
print("\nTest Accounts:")
print("- Admin: admin@example.com / admin123")
print("- Artists: artist1@example.com, artist2@example.com, artist3@example.com / password123")
print("- Clients: client1@example.com, client2@example.com / password123")
