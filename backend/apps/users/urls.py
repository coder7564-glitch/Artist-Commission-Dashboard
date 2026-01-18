"""
URL configuration for users app.
"""

from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('password/change/', views.PasswordChangeView.as_view(), name='password-change'),
    path('', views.UserListView.as_view(), name='user-list'),
    path('<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
    path('dashboard/stats/', views.dashboard_stats, name='dashboard-stats'),
]
