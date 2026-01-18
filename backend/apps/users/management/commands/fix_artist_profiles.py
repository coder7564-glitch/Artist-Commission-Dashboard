"""
Django management command to fix existing artist users without Artist profiles.
"""

from django.core.management.base import BaseCommand
from apps.users.models import User
from apps.artists.models import Artist


class Command(BaseCommand):
    help = 'Creates Artist profiles for existing artist users who do not have one'

    def handle(self, *args, **options):
        # Find all users with 'artist' role who don't have an Artist profile
        artist_users = User.objects.filter(role=User.Role.ARTIST)
        
        created_count = 0
        for user in artist_users:
            # Check if user already has an Artist profile
            if not hasattr(user, 'artist_profile') or user.artist_profile is None:
                try:
                    Artist.objects.create(
                        user=user,
                        display_name=f"{user.first_name} {user.last_name}".strip() or user.username,
                        specialty="General",
                        status=Artist.Status.PENDING,
                    )
                    created_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(f'Created Artist profile for: {user.email}')
                    )
                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(f'Failed to create profile for {user.email}: {e}')
                    )
        
        if created_count > 0:
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created {created_count} Artist profile(s)')
            )
        else:
            self.stdout.write(
                self.style.WARNING('No missing Artist profiles found')
            )
