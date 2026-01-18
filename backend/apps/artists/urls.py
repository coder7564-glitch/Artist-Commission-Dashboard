"""
URL configuration for artists app.
"""

from django.urls import path
from . import views

urlpatterns = [
    path('', views.ArtistListView.as_view(), name='artist-list'),
    path('create/', views.ArtistCreateView.as_view(), name='artist-create'),
    path('me/', views.ArtistUpdateView.as_view(), name='artist-me'),
    path('<int:pk>/', views.ArtistDetailView.as_view(), name='artist-detail'),
    
    # Portfolio
    path('portfolio/', views.PortfolioListCreateView.as_view(), name='portfolio-list'),
    path('portfolio/<int:pk>/', views.PortfolioDetailView.as_view(), name='portfolio-detail'),
    
    # Admin endpoints
    path('admin/list/', views.ArtistAdminListView.as_view(), name='artist-admin-list'),
    path('admin/<int:pk>/', views.ArtistAdminUpdateView.as_view(), name='artist-admin-update'),
]
