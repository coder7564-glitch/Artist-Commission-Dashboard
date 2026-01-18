"""
Notification model (Table 10)
"""

from django.db import models
from django.conf import settings


class Notification(models.Model):
    """User notifications."""
    
    class Type(models.TextChoices):
        COMMISSION_REQUEST = 'commission_request', 'New Commission Request'
        COMMISSION_ACCEPTED = 'commission_accepted', 'Commission Accepted'
        COMMISSION_REJECTED = 'commission_rejected', 'Commission Rejected'
        COMMISSION_UPDATE = 'commission_update', 'Commission Update'
        COMMISSION_COMPLETED = 'commission_completed', 'Commission Completed'
        REVISION_SUBMITTED = 'revision_submitted', 'Revision Submitted'
        PAYMENT_RECEIVED = 'payment_received', 'Payment Received'
        PAYMENT_SENT = 'payment_sent', 'Payment Sent'
        REVIEW_RECEIVED = 'review_received', 'Review Received'
        SYSTEM = 'system', 'System Notification'
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    type = models.CharField(max_length=30, choices=Type.choices)
    title = models.CharField(max_length=200)
    message = models.TextField()
    link = models.CharField(max_length=500, blank=True, null=True)
    data = models.JSONField(default=dict, blank=True)
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notifications'
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.title}"
    
    @classmethod
    def create_notification(cls, user, notification_type, title, message, link=None, data=None):
        """Helper method to create notifications."""
        return cls.objects.create(
            user=user,
            type=notification_type,
            title=title,
            message=message,
            link=link,
            data=data or {}
        )
