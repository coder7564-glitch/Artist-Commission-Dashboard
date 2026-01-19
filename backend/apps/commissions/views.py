"""
Commission views for API endpoints.
"""

from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q
from .models import Commission, CommissionCategory, CommissionRevision
from .serializers import (
    CommissionSerializer, CommissionCreateSerializer, CommissionUpdateSerializer,
    CommissionListSerializer, CommissionCategorySerializer, 
    CommissionRevisionSerializer, CommissionReviewSerializer
)
from apps.users.permissions import IsAdminUser


class CommissionCategoryListView(generics.ListAPIView):
    """List all commission categories."""
    
    queryset = CommissionCategory.objects.filter(is_active=True)
    serializer_class = CommissionCategorySerializer
    permission_classes = [permissions.AllowAny]


class CommissionCategoryAdminView(generics.ListCreateAPIView):
    """Admin manage categories."""
    
    queryset = CommissionCategory.objects.all()
    serializer_class = CommissionCategorySerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]


class CommissionCreateView(generics.CreateAPIView):
    """Create a new commission request."""
    
    serializer_class = CommissionCreateSerializer
    permission_classes = [permissions.IsAuthenticated]


class CommissionListView(generics.ListAPIView):
    """List commissions for current user (client or artist)."""
    
    serializer_class = CommissionListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status', 'priority']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'deadline', 'final_price']
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'artist' and hasattr(user, 'artist_profile'):
            return Commission.objects.filter(artist=user.artist_profile)
        return Commission.objects.filter(client=user)


class CommissionDetailView(generics.RetrieveAPIView):
    """Get commission details."""
    
    serializer_class = CommissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Commission.objects.all()
        if user.role == 'artist' and hasattr(user, 'artist_profile'):
            return Commission.objects.filter(
                Q(artist=user.artist_profile) | Q(client=user)
            )
        return Commission.objects.filter(client=user)


class CommissionUpdateView(generics.UpdateAPIView):
    """Update commission (artist/admin)."""
    
    serializer_class = CommissionUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Commission.objects.all()
        if user.role == 'artist' and hasattr(user, 'artist_profile'):
            return Commission.objects.filter(artist=user.artist_profile)
        return Commission.objects.none()
    
    def perform_update(self, serializer):
        instance = serializer.instance
        new_status = serializer.validated_data.get('status')
        
        if new_status == 'in_progress' and instance.status == 'accepted':
            serializer.save(started_at=timezone.now())
        elif new_status == 'completed':
            serializer.save(completed_at=timezone.now())
            # Update artist stats
            artist = instance.artist
            artist.total_commissions += 1
            artist.save()
        else:
            serializer.save()


class CommissionStatusUpdateView(APIView):
    """Update commission status."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        user = request.user
        new_status = request.data.get('status')
        
        # Get commission based on user role
        if user.role == 'admin':
            commission = get_object_or_404(Commission, pk=pk)
        elif user.role == 'artist' and hasattr(user, 'artist_profile'):
            commission = get_object_or_404(Commission, pk=pk, artist=user.artist_profile)
        else:
            commission = get_object_or_404(Commission, pk=pk, client=user)
        
        valid_transitions = {
            'pending': ['accepted', 'rejected', 'cancelled'],
            'accepted': ['in_progress', 'cancelled'],
            'in_progress': ['revision', 'completed'],
            'revision': ['in_progress', 'completed'],
            'completed': ['out_for_delivery'],
            'out_for_delivery': ['delivered'],
        }
        
        if commission.status in valid_transitions:
            if new_status in valid_transitions[commission.status]:
                commission.status = new_status
                if new_status == 'in_progress' and not commission.started_at:
                    commission.started_at = timezone.now()
                elif new_status == 'completed':
                    commission.completed_at = timezone.now()
                commission.save()
                return Response(CommissionSerializer(commission).data)
        
        return Response(
            {"error": "Invalid status transition"}, 
            status=status.HTTP_400_BAD_REQUEST
        )


class CommissionReviewView(APIView):
    """Add review to completed commission."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        commission = get_object_or_404(
            Commission, pk=pk, client=request.user, status='completed'
        )
        
        serializer = CommissionReviewSerializer(data=request.data)
        if serializer.is_valid():
            commission.client_rating = serializer.validated_data['rating']
            commission.client_review = serializer.validated_data.get('review', '')
            commission.save()
            
            # Update artist rating
            artist = commission.artist
            total_ratings = Commission.objects.filter(
                artist=artist, client_rating__isnull=False
            )
            if total_ratings.exists():
                from django.db.models import Avg
                avg_rating = total_ratings.aggregate(avg=Avg('client_rating'))['avg']
                artist.rating = round(avg_rating, 2)
                artist.total_reviews = total_ratings.count()
                artist.save()
            
            return Response(CommissionSerializer(commission).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RevisionCreateView(generics.CreateAPIView):
    """Create a revision for a commission."""
    
    serializer_class = CommissionRevisionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        commission_id = self.kwargs.get('commission_id')
        user = self.request.user
        
        if user.role == 'artist' and hasattr(user, 'artist_profile'):
            commission = get_object_or_404(
                Commission, pk=commission_id, artist=user.artist_profile
            )
        else:
            return Response(
                {"error": "Only artists can submit revisions"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        revision_number = commission.revisions.count() + 1
        serializer.save(commission=commission, revision_number=revision_number)


class CommissionAdminListView(generics.ListAPIView):
    """List all commissions (admin only)."""
    
    queryset = Commission.objects.all()
    serializer_class = CommissionListSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    filterset_fields = ['status', 'priority', 'artist', 'client']
    search_fields = ['title', 'client__email', 'artist__display_name']
    ordering_fields = ['created_at', 'deadline', 'final_price']


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def commission_stats(request):
    """Get commission statistics for current user."""
    user = request.user
    
    if user.role == 'artist' and hasattr(user, 'artist_profile'):
        commissions = Commission.objects.filter(artist=user.artist_profile)
    else:
        commissions = Commission.objects.filter(client=user)
    
    from django.db.models import Sum, Count
    
    # Calculate earnings from delivered orders
    delivered_commissions = commissions.filter(status='delivered')
    total_earnings = delivered_commissions.aggregate(total=Sum('final_price'))['total'] or 0
    
    stats = {
        'total': commissions.count(),
        'pending': commissions.filter(status='pending').count(),
        'in_progress': commissions.filter(status='in_progress').count(),
        'completed': commissions.filter(status='completed').count(),
        'delivered': delivered_commissions.count(),
        'cancelled': commissions.filter(status='cancelled').count(),
        'total_spent': float(total_earnings),  # For clients - money spent
        'total_earned': float(total_earnings),  # For artists - money earned
    }
    
    return Response(stats)


class ReferenceImageUploadView(APIView):
    """Upload reference images for a commission."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        user = request.user
        
        # Get commission - client or admin can upload
        if user.role == 'admin':
            commission = get_object_or_404(Commission, pk=pk)
        else:
            commission = get_object_or_404(Commission, pk=pk, client=user)
        
        # Get uploaded file
        image_file = request.FILES.get('image')
        if not image_file:
            return Response(
                {"error": "No image file provided"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate file type
        allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if image_file.content_type not in allowed_types:
            return Response(
                {"error": "Invalid file type. Allowed: JPEG, PNG, GIF, WebP"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Limit file size (5MB)
        if image_file.size > 5 * 1024 * 1024:
            return Response(
                {"error": "File too large. Maximum size is 5MB"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Save file
        import os
        from django.conf import settings
        from django.core.files.storage import default_storage
        import uuid
        
        # Generate unique filename
        ext = os.path.splitext(image_file.name)[1]
        filename = f"commissions/references/{commission.id}/{uuid.uuid4()}{ext}"
        
        # Save file
        saved_path = default_storage.save(filename, image_file)
        file_url = request.build_absolute_uri(f"{settings.MEDIA_URL}{saved_path}")
        
        # Update reference_images JSON field
        images = commission.reference_images or []
        images.append({
            'url': file_url,
            'filename': image_file.name,
            'uploaded_at': timezone.now().isoformat(),
        })
        commission.reference_images = images
        commission.save()
        
        return Response({
            "message": "Image uploaded successfully",
            "image": images[-1],
            "total_images": len(images),
        })
    
    def delete(self, request, pk):
        """Delete a reference image."""
        user = request.user
        
        if user.role == 'admin':
            commission = get_object_or_404(Commission, pk=pk)
        else:
            commission = get_object_or_404(Commission, pk=pk, client=user)
        
        image_url = request.data.get('url')
        if not image_url:
            return Response(
                {"error": "Image URL is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        images = commission.reference_images or []
        commission.reference_images = [img for img in images if img.get('url') != image_url]
        commission.save()
        
        return Response({"message": "Image deleted successfully"})
