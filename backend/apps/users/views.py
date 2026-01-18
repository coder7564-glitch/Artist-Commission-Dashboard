"""
User views for API endpoints.
"""

from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from .serializers import (
    UserSerializer, UserRegistrationSerializer, 
    UserUpdateSerializer, PasswordChangeSerializer
)
from .permissions import IsAdminUser, IsOwnerOrAdmin

User = get_user_model()


class UserRegistrationView(generics.CreateAPIView):
    """Handle user registration."""
    
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get and update current user's profile."""
    
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return UserUpdateSerializer
        return UserSerializer


class UserListView(generics.ListAPIView):
    """List all users (admin only)."""
    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    filterset_fields = ['role', 'is_verified', 'is_active']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering_fields = ['created_at', 'email']


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a specific user (admin only)."""
    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return UserUpdateSerializer
        return UserSerializer


class PasswordChangeView(APIView):
    """Handle password change."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()
            return Response({"message": "Password changed successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsAdminUser])
def dashboard_stats(request):
    """Get dashboard statistics for admin."""
    from apps.commissions.models import Commission
    from apps.artists.models import Artist
    from apps.payments.models import Payment
    from django.db.models import Sum, Count
    from django.utils import timezone
    from datetime import timedelta
    
    thirty_days_ago = timezone.now() - timedelta(days=30)
    
    stats = {
        'total_users': User.objects.count(),
        'total_artists': Artist.objects.count(),
        'total_commissions': Commission.objects.count(),
        'pending_commissions': Commission.objects.filter(status='pending').count(),
        'active_commissions': Commission.objects.filter(status='in_progress').count(),
        'completed_commissions': Commission.objects.filter(status='completed').count(),
        'total_revenue': Payment.objects.filter(status='completed').aggregate(
            total=Sum('amount'))['total'] or 0,
        'monthly_revenue': Payment.objects.filter(
            status='completed', 
            created_at__gte=thirty_days_ago
        ).aggregate(total=Sum('amount'))['total'] or 0,
        'new_users_monthly': User.objects.filter(created_at__gte=thirty_days_ago).count(),
    }
    
    return Response(stats)
