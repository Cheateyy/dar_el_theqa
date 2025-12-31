from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from users.models import Partner

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


class PartnerAutoLinkTests(APITestCase):
	def test_partner_role_user_links_existing_partner_by_email(self):
		partner = Partner.objects.create(company_name="Acme", email="p@example.com")
		user = User.objects.create_user(
			email="p@example.com",
			username="p",
			password="pass12345",
			role=User.Role.PARTNER,
		)
		user.refresh_from_db()
		self.assertEqual(user.partner_id, partner.id)

	def test_partner_role_user_auto_creates_partner_if_missing(self):
		self.assertEqual(Partner.objects.count(), 0)
		user = User.objects.create_user(
			email="newpartner@example.com",
			username="np",
			password="pass12345",
			role=User.Role.PARTNER,
			first_name="New",
			last_name="Partner",
		)
		user.refresh_from_db()
		self.assertIsNotNone(user.partner_id)
		self.assertEqual(Partner.objects.count(), 1)
		self.assertEqual(user.partner.email, "newpartner@example.com")
