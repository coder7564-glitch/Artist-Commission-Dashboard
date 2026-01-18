"""
URL configuration for notifications app.
"""

from django.urls import path
from . import views

urlpatterns = [
    path('', views.NotificationListView.as_view(), name='notification-list'),
    path('unread-count/', views.unread_count, name='notification-unread-count'),
    path('mark-all-read/', views.MarkAllNotificationsReadView.as_view(), name='notification-mark-all-read'),
    path('<int:pk>/', views.NotificationDetailView.as_view(), name='notification-detail'),
    path('<int:pk>/read/', views.MarkNotificationReadView.as_view(), name='notification-mark-read'),
]
