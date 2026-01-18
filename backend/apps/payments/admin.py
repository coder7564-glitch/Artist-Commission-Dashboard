"""
Admin configuration for payments app.
"""

from django.contrib import admin
from .models import Payment, PaymentMethod


@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'type', 'is_default', 'is_active', 'created_at')
    list_filter = ('type', 'is_default', 'is_active')
    search_fields = ('user__email', 'name')


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'commission', 'payer', 'payee', 'amount', 
                    'status', 'type', 'created_at')
    list_filter = ('status', 'type', 'currency')
    search_fields = ('payer__email', 'payee__email', 'transaction_id')
    ordering = ('-created_at',)
    readonly_fields = ('transaction_id', 'created_at', 'updated_at')
