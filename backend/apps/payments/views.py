"""
Payment views for API endpoints.
"""

from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q, Sum
from .models import Payment, PaymentMethod
from .serializers import (
    PaymentSerializer, PaymentCreateSerializer, PaymentListSerializer,
    PaymentMethodSerializer
)
from apps.users.permissions import IsAdminUser


class PaymentMethodListCreateView(generics.ListCreateAPIView):
    """List and create payment methods."""
    
    serializer_class = PaymentMethodSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return PaymentMethod.objects.filter(user=self.request.user, is_active=True)


class PaymentMethodDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete payment method."""
    
    serializer_class = PaymentMethodSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return PaymentMethod.objects.filter(user=self.request.user)
    
    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()


class PaymentCreateView(generics.CreateAPIView):
    """Create a payment for a commission."""
    
    serializer_class = PaymentCreateSerializer
    permission_classes = [permissions.IsAuthenticated]


class PaymentListView(generics.ListAPIView):
    """List payments for current user."""
    
    serializer_class = PaymentListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status', 'type']
    ordering_fields = ['created_at', 'amount']
    
    def get_queryset(self):
        user = self.request.user
        return Payment.objects.filter(Q(payer=user) | Q(payee=user))


class PaymentDetailView(generics.RetrieveAPIView):
    """Get payment details."""
    
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Payment.objects.all()
        return Payment.objects.filter(Q(payer=user) | Q(payee=user))


class PaymentProcessView(APIView):
    """Process a payment (simulate payment processing)."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        payment = get_object_or_404(Payment, pk=pk, payer=request.user)
        
        if payment.status != 'pending':
            return Response(
                {"error": "Payment is not in pending status"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Simulate payment processing
        payment.status = 'completed'
        payment.paid_at = timezone.now()
        payment.save()
        
        # Update commission status if needed
        commission = payment.commission
        if commission.status == 'accepted':
            commission.status = 'in_progress'
            commission.started_at = timezone.now()
            commission.save()
        
        return Response(PaymentSerializer(payment).data)


class PaymentAdminListView(generics.ListAPIView):
    """List all payments (admin only)."""
    
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    filterset_fields = ['status', 'type']
    search_fields = ['payer__email', 'payee__email', 'transaction_id']
    ordering_fields = ['created_at', 'amount']


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def payment_stats(request):
    """Get payment statistics for current user."""
    user = request.user
    
    payments_made = Payment.objects.filter(payer=user)
    payments_received = Payment.objects.filter(payee=user)
    
    stats = {
        'total_spent': payments_made.filter(status='completed').aggregate(
            total=Sum('amount'))['total'] or 0,
        'total_earned': payments_received.filter(status='completed').aggregate(
            total=Sum('net_amount'))['total'] or 0,
        'pending_payments': payments_made.filter(status='pending').count(),
        'completed_payments': payments_made.filter(status='completed').count(),
    }
    
    return Response(stats)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsAdminUser])
def admin_payment_stats(request):
    """Get payment statistics for admin."""
    from datetime import timedelta
    
    thirty_days_ago = timezone.now() - timedelta(days=30)
    
    stats = {
        'total_revenue': Payment.objects.filter(status='completed').aggregate(
            total=Sum('amount'))['total'] or 0,
        'total_platform_fees': Payment.objects.filter(status='completed').aggregate(
            total=Sum('platform_fee'))['total'] or 0,
        'monthly_revenue': Payment.objects.filter(
            status='completed', paid_at__gte=thirty_days_ago
        ).aggregate(total=Sum('amount'))['total'] or 0,
        'pending_payments': Payment.objects.filter(status='pending').count(),
        'total_transactions': Payment.objects.filter(status='completed').count(),
    }
    
    return Response(stats)
