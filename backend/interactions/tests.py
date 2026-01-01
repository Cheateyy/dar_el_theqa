from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from interactions.models import Lead
from listings.models import Listing
from locations.models import Wilaya, Region


class LeadEndpointsTests(APITestCase):
	def setUp(self):
		User = get_user_model()
		self.owner = User.objects.create_user(
			email="owner@example.com",
			username="owner",
			password="pass12345",
		)
		self.other_user = User.objects.create_user(
			email="other@example.com",
			username="other",
			password="pass12345",
		)
		self.client_user = User.objects.create_user(
			email="client@example.com",
			username="client",
			password="pass12345",
		)

		self.wilaya = Wilaya.objects.create(name="TestWilaya")
		self.region = Region.objects.create(name="TestRegion", wilaya=self.wilaya)

		self.listing = Listing.objects.create(
			owner=self.owner,
			title="My Listing",
			slug="my-listing",
			description="desc",
			transaction_type=Listing.TransactionType.BUY,
			property_type=Listing.PropertyType.APARTMENT,
			price="1000.00",
			rent_unit=None,
			wilaya=self.wilaya,
			region=self.region,
			address="Somewhere",
			area=100,
			bedrooms=2,
			bathrooms=1,
			floors=1,
		)
		self.lead = Lead.objects.create(user=self.client_user, listing=self.listing, message="hi")

	def test_lead_detail_owner_can_retrieve(self):
		self.client.force_authenticate(user=self.owner)
		res = self.client.get(f"/api/leads/{self.lead.id}/")
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		self.assertEqual(res.data["id"], self.lead.id)

	def test_lead_detail_non_owner_gets_404(self):
		self.client.force_authenticate(user=self.other_user)
		res = self.client.get(f"/api/leads/{self.lead.id}/")
		self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

	def test_vendor_leads_list_owner_sees_leads(self):
		self.client.force_authenticate(user=self.owner)
		res = self.client.get(f"/api/vendor/leads/{self.owner.id}/")
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		self.assertIn("results", res.data)
		self.assertEqual(len(res.data["results"]), 1)
		self.assertEqual(res.data["results"][0]["id"], self.lead.id)

	def test_vendor_leads_list_non_owner_sees_empty(self):
		self.client.force_authenticate(user=self.other_user)
		res = self.client.get(f"/api/vendor/leads/{self.owner.id}/")
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		self.assertIn("results", res.data)
		self.assertEqual(len(res.data["results"]), 0)
