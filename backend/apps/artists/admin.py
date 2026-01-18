"""
Admin configuration for artists app.
"""

from django.contrib import admin
from .models import Artist, ArtistPortfolio


class PortfolioInline(admin.TabularInline):
    model = ArtistPortfolio
    extra = 1


@admin.register(Artist)
class ArtistAdmin(admin.ModelAdmin):
    list_display = ('display_name', 'user', 'specialty', 'status', 
                    'is_accepting_commissions', 'rating', 'created_at')
    list_filter = ('status', 'is_accepting_commissions')
    search_fields = ('display_name', 'user__email', 'specialty')
    ordering = ('-created_at',)
    inlines = [PortfolioInline]


@admin.register(ArtistPortfolio)
class ArtistPortfolioAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'is_featured', 'order', 'created_at')
    list_filter = ('is_featured',)
    search_fields = ('title', 'artist__display_name')
