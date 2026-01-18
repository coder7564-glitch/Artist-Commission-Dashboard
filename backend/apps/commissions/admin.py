"""
Admin configuration for commissions app.
"""

from django.contrib import admin
from .models import Commission, CommissionCategory, CommissionRevision


@admin.register(CommissionCategory)
class CommissionCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'order', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('name',)
    ordering = ('order', 'name')


class RevisionInline(admin.TabularInline):
    model = CommissionRevision
    extra = 0
    readonly_fields = ('revision_number', 'created_at')


@admin.register(Commission)
class CommissionAdmin(admin.ModelAdmin):
    list_display = ('title', 'client', 'artist', 'status', 'priority', 
                    'final_price', 'deadline', 'created_at')
    list_filter = ('status', 'priority', 'category')
    search_fields = ('title', 'client__email', 'artist__display_name')
    ordering = ('-created_at',)
    inlines = [RevisionInline]
    readonly_fields = ('created_at', 'updated_at', 'started_at', 'completed_at')


@admin.register(CommissionRevision)
class CommissionRevisionAdmin(admin.ModelAdmin):
    list_display = ('commission', 'revision_number', 'is_approved', 'created_at')
    list_filter = ('is_approved',)
    search_fields = ('commission__title',)
