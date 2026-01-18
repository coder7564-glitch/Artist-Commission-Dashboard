"""
URL configuration for commissions app.
"""

from django.urls import path
from . import views

urlpatterns = [
    # Categories
    path('categories/', views.CommissionCategoryListView.as_view(), name='category-list'),
    path('categories/admin/', views.CommissionCategoryAdminView.as_view(), name='category-admin'),
    
    # Commissions
    path('', views.CommissionListView.as_view(), name='commission-list'),
    path('create/', views.CommissionCreateView.as_view(), name='commission-create'),
    path('stats/', views.commission_stats, name='commission-stats'),
    path('<int:pk>/', views.CommissionDetailView.as_view(), name='commission-detail'),
    path('<int:pk>/update/', views.CommissionUpdateView.as_view(), name='commission-update'),
    path('<int:pk>/status/', views.CommissionStatusUpdateView.as_view(), name='commission-status'),
    path('<int:pk>/review/', views.CommissionReviewView.as_view(), name='commission-review'),
    
    # Revisions
    path('<int:commission_id>/revisions/', views.RevisionCreateView.as_view(), name='revision-create'),
    
    # Reference Images
    path('<int:pk>/reference-images/', views.ReferenceImageUploadView.as_view(), name='reference-images'),
    
    # Admin
    path('admin/list/', views.CommissionAdminListView.as_view(), name='commission-admin-list'),
]
