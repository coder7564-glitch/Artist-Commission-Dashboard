"""
Payment serializers for API endpoints.
"""

from rest_framework import serializers
from .models import Payment, PaymentMethod


class PaymentMethodSerializer(serializers.ModelSerializer):
    """Serializer for PaymentMethod model."""
    
    class Meta:
        model = PaymentMethod
        fields = ['id', 'type', 'name', 'details', 'is_default', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for Payment model."""
    
    payer_email = serializers.EmailField(source='payer.email', read_only=True)
    payee_email = serializers.EmailField(source='payee.email', read_only=True)
    commission_title = serializers.CharField(source='commission.title', read_only=True)
    
    class Meta:
        model = Payment
        fields = ['id', 'commission', 'commission_title', 'payer', 'payer_email',
                  'payee', 'payee_email', 'payment_method', 'amount', 'platform_fee',
                  'net_amount', 'currency', 'type', 'status', 'transaction_id',
                  'notes', 'paid_at', 'created_at']
        read_only_fields = ['id', 'payer', 'payee', 'net_amount', 'transaction_id',
                           'paid_at', 'created_at']


class PaymentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating payments."""
    
    commission_id = serializers.IntegerField(write_only=True)
    payment_method_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Payment
        fields = ['commission_id', 'payment_method_id', 'amount', 'type', 'notes']
    
    def create(self, validated_data):
        from apps.commissions.models import Commission
        import uuid
        
        commission_id = validated_data.pop('commission_id')
        payment_method_id = validated_data.pop('payment_method_id', None)
        
        commission = Commission.objects.get(id=commission_id)
        user = self.context['request'].user
        
        payment_method = None
        if payment_method_id:
            payment_method = PaymentMethod.objects.get(id=payment_method_id, user=user)
        
        # Calculate platform fee (5%)
        amount = validated_data.get('amount')
        platform_fee = amount * 0.05
        net_amount = amount - platform_fee
        
        payment = Payment.objects.create(
            commission=commission,
            payer=user,
            payee=commission.artist.user,
            payment_method=payment_method,
            platform_fee=platform_fee,
            net_amount=net_amount,
            transaction_id=f"TXN-{uuid.uuid4().hex[:12].upper()}",
            **validated_data
        )
        return payment


class PaymentListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for payment listings."""
    
    commission_title = serializers.CharField(source='commission.title', read_only=True)
    
    class Meta:
        model = Payment
        fields = ['id', 'commission_title', 'amount', 'currency', 
                  'type', 'status', 'created_at']
