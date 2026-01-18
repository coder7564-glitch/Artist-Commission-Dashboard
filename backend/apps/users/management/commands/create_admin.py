"""
Django management command to create a default admin user.
"""

from django.core.management.base import BaseCommand
from apps.users.models import User, UserProfile


class Command(BaseCommand):
    help = 'Creates a default admin user if it does not exist'

    def handle(self, *args, **options):
        admin_email = 'naman7564@gmail.com'
        admin_username = 'naman'
        admin_password = 'naman7564'
        
        if User.objects.filter(email=admin_email).exists():
            self.stdout.write(
                self.style.WARNING(f'Admin user {admin_email} already exists')
            )
            return
        
        # Create admin user
        admin_user = User.objects.create_user(
            username=admin_username,
            email=admin_email,
            password=admin_password,
            first_name='Naman',
            last_name='Jain',
            role=User.Role.ADMIN,
            is_staff=True,
            is_superuser=True,
            is_verified=True,
        )
        
        # Create user profile
        UserProfile.objects.create(user=admin_user)
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created admin user: {admin_email}')
        )
