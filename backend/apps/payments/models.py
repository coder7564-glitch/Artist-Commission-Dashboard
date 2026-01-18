"""
Payment models - Payment and PaymentMethod (Tables 8-9)
"""

from django.db import models
from django.conf import settings


class PaymentMethod(models.Model):
    """User payment methods."""
    
    class Type(models.TextChoices):
        CREDIT_CARD = 'credit_card', 'Credit Card'
        DEBIT_CARD = 'debit_card', 'Debit Card'
        PAYPAL = 'paypal', 'PayPal'
        BANK_TRANSFER = 'bank_transfer', 'Bank Transfer'
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='payment_methods'
    )
    type = models.CharField(max_length=20, choices=Type.choices)
    name = models.CharField(max_length=100)
    details = models.JSONField(default=dict)  # Encrypted card details, etc.
    is_default = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'payment_methods'
        verbose_name = 'Payment Method'
        verbose_name_plural = 'Payment Methods'
    
    def __str__(self):
        return f"{self.user.email} - {self.name}"
    
    def save(self, *args, **kwargs):
        if self.is_default:
            PaymentMethod.objects.filter(
                user=self.user, is_default=True
            ).update(is_default=False)
        super().save(*args, **kwargs)


class Payment(models.Model):
    """Payment transactions."""
    
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        PROCESSING = 'processing', 'Processing'
        COMPLETED = 'completed', 'Completed'
        FAILED = 'failed', 'Failed'
        REFUNDED = 'refunded', 'Refunded'
        CANCELLED = 'cancelled', 'Cancelled'
    
    class Type(models.TextChoices):
        COMMISSION = 'commission', 'Commission Payment'
        DEPOSIT = 'deposit', 'Deposit'
        REFUND = 'refund', 'Refund'
        TIP = 'tip', 'Tip'
    
    commission = models.ForeignKey(
        'commissions.Commission',
        on_delete=models.CASCADE,
        related_name='payments'
    )
    payer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='payments_made'
    )
    payee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='payments_received'
    )
    payment_method = models.ForeignKey(
        PaymentMethod,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    net_amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    type = models.CharField(max_length=20, choices=Type.choices, default=Type.COMMISSION)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    transaction_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'payments'
        verbose_name = 'Payment'
        verbose_name_plural = 'Payments'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Payment #{self.id} - {self.amount} {self.currency}"
    
    def save(self, *args, **kwargs):
        if not self.net_amount:
            self.net_amount = self.amount - self.platform_fee
        super().save(*args, **kwargs)
