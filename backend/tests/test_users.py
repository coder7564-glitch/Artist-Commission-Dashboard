"""
Tests for users app.
"""

import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.users.models import User


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def create_user():
    def _create_user(email='test@example.com', password='testpass123', role='client'):
        user = User.objects.create_user(
            username=email.split('@')[0],
            email=email,
            password=password,
            role=role
        )
        return user
    return _create_user


@pytest.mark.django_db
class TestUserRegistration:
    def test_user_registration_success(self, api_client):
        url = reverse('user-register')
        data = {
            'email': 'newuser@example.com',
            'username': 'newuser',
            'password': 'StrongPass123!',
            'password_confirm': 'StrongPass123!',
            'first_name': 'New',
            'last_name': 'User',
            'role': 'client'
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(email='newuser@example.com').exists()
    
    def test_user_registration_password_mismatch(self, api_client):
        url = reverse('user-register')
        data = {
            'email': 'newuser@example.com',
            'username': 'newuser',
            'password': 'StrongPass123!',
            'password_confirm': 'DifferentPass123!',
            'role': 'client'
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestUserAuthentication:
    def test_user_login_success(self, api_client, create_user):
        user = create_user()
        url = reverse('token_obtain_pair')
        data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data
    
    def test_user_login_invalid_credentials(self, api_client, create_user):
        create_user()
        url = reverse('token_obtain_pair')
        data = {
            'email': 'test@example.com',
            'password': 'wrongpassword'
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestUserProfile:
    def test_get_profile_authenticated(self, api_client, create_user):
        user = create_user()
        api_client.force_authenticate(user=user)
        url = reverse('user-profile')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['email'] == user.email
    
    def test_get_profile_unauthenticated(self, api_client):
        url = reverse('user-profile')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
