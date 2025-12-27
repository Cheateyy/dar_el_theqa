from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from locations.models import Wilaya, Region
from listings.models import Listing
import json


User = get_user_model()


class ListingCreateDocumentNotesTests(APITestCase):
	def setUp(self):
		self.user = User.objects.create_user(
			email="seller@example.com",
			username="seller",
			password="sellerpass123",
			is_active=True,
		)
		self.wilaya = Wilaya.objects.create(name="Test Wilaya")
		self.region = Region.objects.create(wilaya=self.wilaya, name="Test Region")

	def test_create_listing_saves_document_notes_and_generates_slug(self):
		self.client.force_authenticate(user=self.user)
		url = reverse("create-listing")

		payload = {
			"title": "My Test Listing",
			"transaction_type": "BUY",
			"property_type": "APARTMENT",
			"price": "100000.00",
			"wilaya": self.wilaya.id,
			"region": self.region.id,
			"address": "123 Test Street",
			"area": 120,
			"bedrooms": 2,
			"bathrooms": 1,
			"floors": 1,
			"description": "Nice place",
			"document_notes": json.dumps({
				"docidentity": "will provide later",
				"docregister": "pending renewal",
			}),
		}

		res = self.client.post(url, payload, format="multipart")

		self.assertEqual(res.status_code, status.HTTP_201_CREATED)
		listing = Listing.objects.get(id=res.data["id"]) if "id" in res.data else Listing.objects.order_by("-id").first()
		self.assertTrue(bool(listing.slug))
		self.assertEqual(listing.document_notes.get("docidentity"), "will provide later")


class ListingSlugGenerationTests(APITestCase):
	def setUp(self):
		self.user = User.objects.create_user(
			email="seller2@example.com",
			username="seller2",
			password="sellerpass123",
			is_active=True,
		)
		self.wilaya = Wilaya.objects.create(name="Slug Wilaya")
		self.region = Region.objects.create(wilaya=self.wilaya, name="Slug Region")

	def test_two_listings_can_be_created_with_empty_slug_and_same_title(self):
		listing1 = Listing.objects.create(
			owner=self.user,
			title="Same Title",
			description="Desc",
			transaction_type="BUY",
			property_type="APARTMENT",
			price="100.00",
			wilaya=self.wilaya,
			region=self.region,
			address="Addr",
			area=10,
			bedrooms=1,
			bathrooms=1,
			floors=1,
		)

		listing2 = Listing.objects.create(
			owner=self.user,
			title="Same Title",
			description="Desc",
			transaction_type="BUY",
			property_type="APARTMENT",
			price="100.00",
			wilaya=self.wilaya,
			region=self.region,
			address="Addr",
			area=10,
			bedrooms=1,
			bathrooms=1,
			floors=1,
		)

		self.assertTrue(bool(listing1.slug))
		self.assertTrue(bool(listing2.slug))
		self.assertNotEqual(listing1.slug, listing2.slug)
