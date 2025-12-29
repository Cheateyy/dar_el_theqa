from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


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
