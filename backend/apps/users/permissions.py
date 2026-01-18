"""
Custom permissions for user management.
"""

from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """Permission for admin users only."""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'


class IsArtistUser(permissions.BasePermission):
    """Permission for artist users only."""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'artist'


class IsClientUser(permissions.BasePermission):
    """Permission for client users only."""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'client'


class IsOwnerOrAdmin(permissions.BasePermission):
    """Permission for object owner or admin."""
    
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        return obj == request.user or getattr(obj, 'user', None) == request.user


class IsArtistOwnerOrAdmin(permissions.BasePermission):
    """Permission for artist owner or admin."""
    
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        return getattr(obj, 'artist', None) and obj.artist.user == request.user
