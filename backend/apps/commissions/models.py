"""
Commission models - Category, Commission, Revision (Tables 5-7)
"""

from django.db import models
from django.conf import settings


class CommissionCategory(models.Model):
    """Categories for commission types."""
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'commission_categories'
        verbose_name = 'Commission Category'
        verbose_name_plural = 'Commission Categories'
        ordering = ['order', 'name']
    
    def __str__(self):
        return self.name


class Commission(models.Model):
    """Commission requests from clients to artists."""
    
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        ACCEPTED = 'accepted', 'Accepted'
        IN_PROGRESS = 'in_progress', 'In Progress'
        REVISION = 'revision', 'Revision Requested'
        COMPLETED = 'completed', 'Completed'
        OUT_FOR_DELIVERY = 'out_for_delivery', 'Out for Delivery'
        DELIVERED = 'delivered', 'Delivered'
        CANCELLED = 'cancelled', 'Cancelled'
        REJECTED = 'rejected', 'Rejected'
    
    class Priority(models.TextChoices):
        LOW = 'low', 'Low'
        NORMAL = 'normal', 'Normal'
        HIGH = 'high', 'High'
        URGENT = 'urgent', 'Urgent'
    
    client = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='client_commissions'
    )
    artist = models.ForeignKey(
        'artists.Artist',
        on_delete=models.CASCADE,
        related_name='artist_commissions'
    )
    category = models.ForeignKey(
        CommissionCategory,
        on_delete=models.SET_NULL,
        null=True,
        related_name='commissions'
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    reference_images = models.JSONField(default=list, blank=True)
    requirements = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    priority = models.CharField(max_length=20, choices=Priority.choices, default=Priority.NORMAL)
    quoted_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    final_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    deadline = models.DateField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    revisions_allowed = models.PositiveIntegerField(default=2)
    revisions_used = models.PositiveIntegerField(default=0)
    final_artwork = models.ImageField(upload_to='commissions/final/', null=True, blank=True)
    client_rating = models.PositiveIntegerField(null=True, blank=True)
    client_review = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'commissions'
        verbose_name = 'Commission'
        verbose_name_plural = 'Commissions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.client.username} to {self.artist.display_name}"


class CommissionRevision(models.Model):
    """Revision history for commissions."""
    
    commission = models.ForeignKey(
        Commission,
        on_delete=models.CASCADE,
        related_name='revisions'
    )
    revision_number = models.PositiveIntegerField()
    artwork = models.ImageField(upload_to='commissions/revisions/')
    notes = models.TextField(blank=True, null=True)
    client_feedback = models.TextField(blank=True, null=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'commission_revisions'
        verbose_name = 'Commission Revision'
        verbose_name_plural = 'Commission Revisions'
        ordering = ['revision_number']
        unique_together = ['commission', 'revision_number']
    
    def __str__(self):
        return f"{self.commission.title} - Revision {self.revision_number}"
