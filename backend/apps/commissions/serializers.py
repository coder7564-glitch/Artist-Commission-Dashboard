"""
Commission serializers for API endpoints.
"""

from rest_framework import serializers
from .models import Commission, CommissionCategory, CommissionRevision
from apps.users.serializers import UserSerializer
from apps.artists.serializers import ArtistListSerializer


class CommissionCategorySerializer(serializers.ModelSerializer):
    """Serializer for CommissionCategory model."""
    
    class Meta:
        model = CommissionCategory
        fields = ['id', 'name', 'description', 'icon', 'is_active', 'order']


class CommissionRevisionSerializer(serializers.ModelSerializer):
    """Serializer for CommissionRevision model."""
    
    class Meta:
        model = CommissionRevision
        fields = ['id', 'revision_number', 'artwork', 'notes', 
                  'client_feedback', 'is_approved', 'created_at']
        read_only_fields = ['id', 'revision_number', 'created_at']


class CommissionSerializer(serializers.ModelSerializer):
    """Serializer for Commission model."""
    
    client = UserSerializer(read_only=True)
    artist = ArtistListSerializer(read_only=True)
    category = CommissionCategorySerializer(read_only=True)
    revisions = CommissionRevisionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Commission
        fields = ['id', 'client', 'artist', 'category', 'title', 'description',
                  'reference_images', 'requirements', 'status', 'priority',
                  'quoted_price', 'final_price', 'deadline', 'started_at',
                  'completed_at', 'revisions_allowed', 'revisions_used',
                  'final_artwork', 'client_rating', 'client_review', 'notes',
                  'revisions', 'created_at', 'updated_at']
        read_only_fields = ['id', 'client', 'status', 'revisions_used',
                           'started_at', 'completed_at', 'created_at', 'updated_at']


class CommissionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating commissions."""
    
    artist_id = serializers.IntegerField(write_only=True)
    category_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Commission
        fields = ['artist_id', 'category_id', 'title', 'description',
                  'reference_images', 'requirements', 'priority', 'deadline']
    
    def create(self, validated_data):
        from apps.artists.models import Artist
        
        artist_id = validated_data.pop('artist_id')
        category_id = validated_data.pop('category_id', None)
        
        artist = Artist.objects.get(id=artist_id)
        category = None
        if category_id:
            category = CommissionCategory.objects.get(id=category_id)
        
        commission = Commission.objects.create(
            client=self.context['request'].user,
            artist=artist,
            category=category,
            **validated_data
        )
        return commission


class CommissionUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating commissions."""
    
    class Meta:
        model = Commission
        fields = ['status', 'quoted_price', 'final_price', 'deadline',
                  'revisions_allowed', 'notes', 'final_artwork']


class CommissionListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for commission listings."""
    
    client_name = serializers.CharField(source='client.username', read_only=True)
    artist_name = serializers.CharField(source='artist.display_name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Commission
        fields = ['id', 'title', 'client_name', 'artist_name', 'category_name',
                  'status', 'priority', 'final_price', 'deadline', 'created_at']


class CommissionReviewSerializer(serializers.Serializer):
    """Serializer for adding client review."""
    
    rating = serializers.IntegerField(min_value=1, max_value=5)
    review = serializers.CharField(required=False, allow_blank=True)
