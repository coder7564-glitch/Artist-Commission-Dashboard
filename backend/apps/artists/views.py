"""
Artist views for API endpoints.
"""

from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from .models import Artist, ArtistPortfolio
from .serializers import (
    ArtistSerializer, ArtistCreateSerializer, 
    ArtistListSerializer, ArtistPortfolioSerializer
)
from apps.users.permissions import IsAdminUser, IsArtistUser, IsOwnerOrAdmin


class ArtistListView(generics.ListAPIView):
    """List all approved artists."""
    
    queryset = Artist.objects.filter(status='approved')
    serializer_class = ArtistListSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ['specialty', 'is_accepting_commissions']
    search_fields = ['display_name', 'specialty', 'description']
    ordering_fields = ['rating', 'minimum_price', 'created_at']


class ArtistDetailView(generics.RetrieveAPIView):
    """Get artist details."""
    
    queryset = Artist.objects.filter(status='approved')
    serializer_class = ArtistSerializer
    permission_classes = [permissions.AllowAny]


class ArtistCreateView(generics.CreateAPIView):
    """Create artist profile."""
    
    serializer_class = ArtistCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save()


class ArtistUpdateView(generics.UpdateAPIView):
    """Update artist profile."""
    
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return get_object_or_404(Artist, user=self.request.user)


class ArtistAdminListView(generics.ListAPIView):
    """List all artists for admin."""
    
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    filterset_fields = ['status', 'is_accepting_commissions']
    search_fields = ['display_name', 'user__email']


class ArtistAdminUpdateView(generics.UpdateAPIView):
    """Update artist status (admin only)."""
    
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def patch(self, request, *args, **kwargs):
        artist = self.get_object()
        new_status = request.data.get('status')
        if new_status in ['pending', 'approved', 'suspended']:
            artist.status = new_status
            artist.save()
            return Response(ArtistSerializer(artist).data)
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)


class PortfolioListCreateView(generics.ListCreateAPIView):
    """List and create portfolio items."""
    
    serializer_class = ArtistPortfolioSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        return ArtistPortfolio.objects.filter(artist__user=self.request.user)
    
    def perform_create(self, serializer):
        artist = get_object_or_404(Artist, user=self.request.user)
        serializer.save(artist=artist)


class PortfolioDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete portfolio item."""
    
    serializer_class = ArtistPortfolioSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        return ArtistPortfolio.objects.filter(artist__user=self.request.user)
