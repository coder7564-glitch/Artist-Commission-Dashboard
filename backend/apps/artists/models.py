"""
Artist models - Artist and ArtistPortfolio (Tables 3-4)
"""

from django.db import models
from django.conf import settings


class Artist(models.Model):
    """Artist profile linked to user."""
    
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending Approval'
        APPROVED = 'approved', 'Approved'
        SUSPENDED = 'suspended', 'Suspended'
    
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='artist_profile'
    )
    display_name = models.CharField(max_length=100)
    specialty = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    minimum_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    maximum_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    turnaround_days = models.PositiveIntegerField(default=7)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    is_accepting_commissions = models.BooleanField(default=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    total_reviews = models.PositiveIntegerField(default=0)
    total_commissions = models.PositiveIntegerField(default=0)
    tags = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'artists'
        verbose_name = 'Artist'
        verbose_name_plural = 'Artists'
    
    def __str__(self):
        return self.display_name


class ArtistPortfolio(models.Model):
    """Portfolio items for artists."""
    
    artist = models.ForeignKey(
        Artist, 
        on_delete=models.CASCADE, 
        related_name='portfolio_items'
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='portfolio/')
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'artist_portfolios'
        verbose_name = 'Portfolio Item'
        verbose_name_plural = 'Portfolio Items'
        ordering = ['order', '-created_at']
    
    def __str__(self):
        return f"{self.artist.display_name} - {self.title}"
