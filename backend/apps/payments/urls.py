"""
URL configuration for payments app.
"""

from django.urls import path
from . import views

urlpatterns = [
    # Payment Methods
    path('methods/', views.PaymentMethodListCreateView.as_view(), name='payment-method-list'),
    path('methods/<int:pk>/', views.PaymentMethodDetailView.as_view(), name='payment-method-detail'),
    
    # Payments
    path('', views.PaymentListView.as_view(), name='payment-list'),
    path('create/', views.PaymentCreateView.as_view(), name='payment-create'),
    path('stats/', views.payment_stats, name='payment-stats'),
    path('<int:pk>/', views.PaymentDetailView.as_view(), name='payment-detail'),
    path('<int:pk>/process/', views.PaymentProcessView.as_view(), name='payment-process'),
    
    # Admin
    path('admin/list/', views.PaymentAdminListView.as_view(), name='payment-admin-list'),
    path('admin/stats/', views.admin_payment_stats, name='payment-admin-stats'),
]
