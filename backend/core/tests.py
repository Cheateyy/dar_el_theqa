from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from core.models import AuditLog


class AuditLogAPITests(APITestCase):
	def setUp(self):
		User = get_user_model()
		self.admin = User.objects.create_user(
			email="admin@example.com",
			username="admin",
			password="pass12345",
			is_staff=True,
			is_superuser=True,
		)
		self.user = User.objects.create_user(
			email="user@example.com",
			username="user",
			password="pass12345",
			is_staff=False,
		)
		self.url = "/api/admin/audit-logs/"

	def test_admin_can_create_and_list_audit_logs(self):
		self.client.force_authenticate(user=self.admin)

		payload = {
			"action_type": "USER_DEACTIVATED",
			"description": "Admin deactivated user 42",
			"target_type": "users.User",
			"target_id": 42,
		}
		create_res = self.client.post(self.url, payload, format="json")
		self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
		self.assertEqual(AuditLog.objects.count(), 1)
		self.assertEqual(AuditLog.objects.first().admin_id, self.admin.id)

		list_res = self.client.get(self.url)
		self.assertEqual(list_res.status_code, status.HTTP_200_OK)
		self.assertEqual(len(list_res.data), 1)
		self.assertEqual(list_res.data[0]["action_type"], payload["action_type"])

	def test_non_admin_cannot_access_audit_logs(self):
		self.client.force_authenticate(user=self.user)

		payload = {
			"action_type": "ANY",
			"description": "Should not be allowed",
			"target_type": "users.User",
			"target_id": 1,
		}
		create_res = self.client.post(self.url, payload, format="json")
		self.assertEqual(create_res.status_code, status.HTTP_403_FORBIDDEN)

		list_res = self.client.get(self.url)
		self.assertEqual(list_res.status_code, status.HTTP_403_FORBIDDEN)

	def test_anonymous_cannot_access_audit_logs(self):
		create_res = self.client.post(
			self.url,
			{
				"action_type": "ANY",
				"description": "Should not be allowed",
				"target_type": "users.User",
				"target_id": 1,
			},
			format="json",
		)
		self.assertIn(
			create_res.status_code,
			(status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
		)

		list_res = self.client.get(self.url)
		self.assertIn(
			list_res.status_code,
			(status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
		)
