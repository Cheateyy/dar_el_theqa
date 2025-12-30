from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from rest_framework import status
from rest_framework.test import APITestCase

from users.models import ActivationOTP

User = get_user_model()


class AdminUserStatusPatchTests(APITestCase):
	def setUp(self):
		self.admin = User.objects.create_superuser(
			email="admin@example.com",
			username="admin",
			password="adminpass123",
		)
		self.user = User.objects.create_user(
			email="user@example.com",
			username="user",
			password="userpass123",
			is_active=True,
		)

	def test_admin_can_patch_user_is_active(self):
		self.client.force_authenticate(user=self.admin)
		url = reverse("admin_user_detail", kwargs={"pk": self.user.pk})

		res = self.client.patch(url, {"is_active": False}, format="json")

		self.assertEqual(res.status_code, status.HTTP_200_OK)
		self.user.refresh_from_db()
		self.assertFalse(self.user.is_active)

	def test_non_admin_cannot_patch_user_is_active(self):
		self.client.force_authenticate(user=self.user)
		url = reverse("admin_user_detail", kwargs={"pk": self.user.pk})

		res = self.client.patch(url, {"is_active": False}, format="json")

		self.assertIn(res.status_code, (status.HTTP_403_FORBIDDEN, status.HTTP_401_UNAUTHORIZED))


class ActivationOTPTests(APITestCase):
	def setUp(self):
		self.user = User.objects.create_user(
			email="otpuser@example.com",
			username="otpuser",
			password="pass12345",
			is_active=False,
		)

	def test_activation_rejects_wrong_code(self):
		ActivationOTP.objects.create(
			user=self.user,
			code="123456",
			expires_at=timezone.now() + timedelta(minutes=10),
		)
		url = reverse("activation")
		res = self.client.post(url, {"email": self.user.email, "code": "000000"}, format="json")
		self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
		self.user.refresh_from_db()
		self.assertFalse(self.user.is_active)

	def test_activation_accepts_correct_code(self):
		ActivationOTP.objects.create(
			user=self.user,
			code="654321",
			expires_at=timezone.now() + timedelta(minutes=10),
		)
		url = reverse("activation")
		res = self.client.post(url, {"email": self.user.email, "code": "654321"}, format="json")
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		self.user.refresh_from_db()
		self.assertTrue(self.user.is_active)
		self.assertIn("token", res.data)

	def test_activation_resend_creates_new_code_for_inactive_user(self):
		url = reverse("activation_resend")
		res = self.client.post(url, {"email": self.user.email}, format="json")
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		self.assertTrue(ActivationOTP.objects.filter(user=self.user).exists())
