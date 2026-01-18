"""
Artist serializers for API endpoints.
"""

from rest_framework import serializers
from .models import Artist, ArtistPortfolio
from apps.users.serializers import UserSerializer


class ArtistPortfolioSerializer(serializers.ModelSerializer):
    """Serializer for ArtistPortfolio model."""
    
    class Meta:
        model = ArtistPortfolio
        fields = ['id', 'title', 'description', 'image', 'is_featured', 'order', 'created_at']
        read_only_fields = ['id', 'created_at']


class ArtistSerializer(serializers.ModelSerializer):
    """Serializer for Artist model."""
    
    user = UserSerializer(read_only=True)
    portfolio_items = ArtistPortfolioSerializer(many=True, read_only=True)
    
    class Meta:
        model = Artist
        fields = ['id', 'user', 'display_name', 'specialty', 'description',
                  'hourly_rate', 'minimum_price', 'maximum_price', 'turnaround_days',
                  'status', 'is_accepting_commissions', 'rating', 'total_reviews',
                  'total_commissions', 'tags', 'portfolio_items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'status', 'rating', 'total_reviews', 
                           'total_commissions', 'created_at', 'updated_at']


class ArtistCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating an artist profile."""
    
    class Meta:
        model = Artist
        fields = ['display_name', 'specialty', 'description', 'hourly_rate',
                  'minimum_price', 'maximum_price', 'turnaround_days', 'tags']
    
    def create(self, validated_data):
        user = self.context['request'].user
        user.role = 'artist'
        user.save()
        return Artist.objects.create(user=user, **validated_data)


class ArtistListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for artist listings."""
    
    username = serializers.CharField(source='user.username', read_only=True)
    avatar = serializers.ImageField(source='user.avatar', read_only=True)
    
    class Meta:
        model = Artist
        fields = ['id', 'username', 'avatar', 'display_name', 'specialty',
                  'minimum_price', 'maximum_price', 'turnaround_days',
                  'is_accepting_commissions', 'rating', 'total_reviews', 'tags']
