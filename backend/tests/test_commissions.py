"""
Tests for commissions app.
"""

import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.users.models import User
from apps.artists.models import Artist
from apps.commissions.models import Commission, CommissionCategory


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def client_user():
    return User.objects.create_user(
        username='client',
        email='client@example.com',
        password='testpass123',
        role='client'
    )


@pytest.fixture
def artist_user():
    user = User.objects.create_user(
        username='artist',
        email='artist@example.com',
        password='testpass123',
        role='artist'
    )
    Artist.objects.create(
        user=user,
        display_name='Test Artist',
        specialty='Digital Art',
        status='approved'
    )
    return user


@pytest.fixture
def category():
    return CommissionCategory.objects.create(
        name='Digital Art',
        description='Digital artwork commissions'
    )


@pytest.mark.django_db
class TestCommissionCreation:
    def test_create_commission_success(self, api_client, client_user, artist_user, category):
        api_client.force_authenticate(user=client_user)
        url = reverse('commission-create')
        data = {
            'artist_id': artist_user.artist_profile.id,
            'category_id': category.id,
            'title': 'Test Commission',
            'description': 'A test commission description',
            'priority': 'normal'
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_201_CREATED
        assert Commission.objects.filter(title='Test Commission').exists()
    
    def test_create_commission_unauthenticated(self, api_client, artist_user, category):
        url = reverse('commission-create')
        data = {
            'artist_id': artist_user.artist_profile.id,
            'title': 'Test Commission',
            'description': 'A test commission description'
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestCommissionList:
    def test_list_commissions_as_client(self, api_client, client_user, artist_user):
        api_client.force_authenticate(user=client_user)
        Commission.objects.create(
            client=client_user,
            artist=artist_user.artist_profile,
            title='Test Commission',
            description='Test description'
        )
        url = reverse('commission-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
    
    def test_list_commissions_as_artist(self, api_client, client_user, artist_user):
        api_client.force_authenticate(user=artist_user)
        Commission.objects.create(
            client=client_user,
            artist=artist_user.artist_profile,
            title='Test Commission',
            description='Test description'
        )
        url = reverse('commission-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
