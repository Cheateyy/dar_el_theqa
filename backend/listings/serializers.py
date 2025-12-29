from typing import Optional
import json

from rest_framework import serializers
from django.utils.text import slugify
from django.utils.crypto import get_random_string

from .models import Listing, ListingImage, ListingDocument
from users.serializers import PartnerSerializer
from locations.models import Wilaya, Region


# ---------------- Images ----------------
class ListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = ["id", "image", "label", "order"]


# ---------------- Documents ----------------
class ListingDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingDocument
        fields = [
            "id",
            "document_type",
            "file",
            "status",
            "admin_note",
            "owner_note",
        ]
        read_only_fields = ["status", "admin_note"]


# ---------------- Listing (read) ----------------
class ListingSerializer(serializers.ModelSerializer):
    wilaya_name = serializers.CharField(source="wilaya.name", read_only=True)
    region_name = serializers.CharField(source="region.name", read_only=True)
    cover_image = serializers.SerializerMethodField()
    partner = PartnerSerializer(read_only=True)
    images = ListingImageSerializer(many=True, read_only=True)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = [
            "id",
            "slug",
            "title",
            "transaction_type",
            "price",
            "rent_unit",
            "wilaya",
            "wilaya_name",
            "region",
            "region_name",
            "cover_image",
            "verification_status",
            "is_liked",
            "partner",
            "property_type",
            "area",
            "bedrooms",
            "bathrooms",
            "floors",
            "description",
            "address",
            "rental_status",
            "available_date",
            "images",
            "status",
            "rejection_reason",
            "created_at",
        ]

    def get_cover_image(self, obj) -> Optional[str]:
        first = obj.images.first()
        return first.image.url if first else None

    def get_is_liked(self, obj) -> bool:
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.favorited_by.filter(user=request.user).exists()
        return False


# ---------------- Listing (create/update) ----------------
class ListingCreateSerializer(serializers.ModelSerializer):

    # Accept single file or list
    class FlexibleFileListField(serializers.ListField):
        def to_internal_value(self, data):
            if data is None:
                return []
            if not isinstance(data, (list, tuple)):
                data = [data]
            return super().to_internal_value(data)

    images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )
    image_labels = serializers.CharField(write_only=True, required=False)

    # frontend aliases
    wilaya_id = serializers.IntegerField(write_only=True, required=False)
    region_id = serializers.IntegerField(write_only=True, required=False)
    street_address = serializers.CharField(write_only=True, required=False)

    # documents (canonical)
    doc_identity = FlexibleFileListField(child=serializers.FileField(), required=False)
    doc_assurance = FlexibleFileListField(child=serializers.FileField(), required=False)
    doc_ownership_1 = FlexibleFileListField(child=serializers.FileField(), required=False)
    doc_ownership_2 = FlexibleFileListField(child=serializers.FileField(), required=False)
    doc_register = FlexibleFileListField(child=serializers.FileField(), required=False)
    doc_silbiya = FlexibleFileListField(child=serializers.FileField(), required=False)

    # frontend aliases (no underscore)
    docidentity = FlexibleFileListField(child=serializers.FileField(), required=False)
    docassurance = FlexibleFileListField(child=serializers.FileField(), required=False)
    docownership1 = FlexibleFileListField(child=serializers.FileField(), required=False)
    docownership2 = FlexibleFileListField(child=serializers.FileField(), required=False)
    docownership3 = FlexibleFileListField(child=serializers.FileField(), required=False)
    docownership4 = FlexibleFileListField(child=serializers.FileField(), required=False)
    docownership5 = FlexibleFileListField(child=serializers.FileField(), required=False)
    docregister = FlexibleFileListField(child=serializers.FileField(), required=False)
    docsilbiya = FlexibleFileListField(child=serializers.FileField(), required=False)

    class Meta:
        model = Listing
        fields = [
            "title",
            "transaction_type",
            "property_type",
            "price",
            "rent_unit",
            "wilaya",
            "region",
            "address",
            "area",
            "bedrooms",
            "bathrooms",
            "floors",
            "description",
            "images",
            "image_labels",
            "wilaya_id",
            "region_id",
            "street_address",
            "doc_identity",
            "doc_assurance",
            "doc_ownership_1",
            "doc_ownership_2",
            "doc_register",
            "doc_silbiya",
            "docidentity",
            "docassurance",
            "docownership1",
            "docownership2",
            "docownership3",
            "docownership4",
            "docownership5",
            "docregister",
            "docsilbiya",
        ]

    # ---------------- VALIDATION ----------------
    def validate(self, attrs):
        request = self.context["request"]

        # aliases
        if "address" not in attrs and "street_address" in attrs:
            attrs["address"] = attrs.pop("street_address")

        if "wilaya" not in attrs and "wilaya_id" in attrs:
            attrs["wilaya"] = Wilaya.objects.get(pk=attrs.pop("wilaya_id"))

        if "region" not in attrs and "region_id" in attrs:
            attrs["region"] = Region.objects.get(pk=attrs.pop("region_id"))

        # strict documents
        for field in ["doc_identity", "doc_assurance", "doc_register", "doc_silbiya"]:
            files = attrs.get(field)
            note = request.data.get(f"{field}_note")
            if not files and not note:
                raise serializers.ValidationError(
                    {field: "Either a document file or a note is required."}
                )

        # ownership rule
        ownership_files = (
            attrs.get("doc_ownership_1", []) + attrs.get("doc_ownership_2", [])
        )
        ownership_note = request.data.get("doc_ownership_note")

        if len(ownership_files) > 2:
            raise serializers.ValidationError(
                {"ownership": "Maximum 2 ownership documents are allowed."}
            )

        if not ownership_files and not ownership_note:
            raise serializers.ValidationError(
                {"ownership": "At least one ownership document or a note is required."}
            )

        return attrs

    # ---------------- CREATE ----------------
    def create(self, validated_data):
        images_data = validated_data.pop("images", [])
        image_labels_json = validated_data.pop("image_labels", "{}")

        # extract alias docs
        alias_docs = {
            k: validated_data.pop(k, [])
            for k in [
                "docidentity",
                "docassurance",
                "docownership1",
                "docownership2",
                "docownership3",
                "docownership4",
                "docownership5",
                "docregister",
                "docsilbiya",
            ]
        }

        docs_data = {
            k: validated_data.pop(k, [])
            for k in [
                "doc_identity",
                "doc_assurance",
                "doc_ownership_1",
                "doc_ownership_2",
                "doc_register",
                "doc_silbiya",
            ]
        }

        # merge aliases
        docs_data["doc_identity"].extend(alias_docs["docidentity"])
        docs_data["doc_assurance"].extend(alias_docs["docassurance"])
        docs_data["doc_register"].extend(alias_docs["docregister"])
        docs_data["doc_silbiya"].extend(alias_docs["docsilbiya"])
        docs_data["doc_ownership_1"].extend(
            alias_docs["docownership1"]
            + alias_docs["docownership2"]
            + alias_docs["docownership3"]
            + alias_docs["docownership4"]
            + alias_docs["docownership5"]
        )

        # slug
        if not validated_data.get("slug"):
            base = slugify(validated_data.get("title", "")) or "listing"
            slug = base
            while Listing.objects.filter(slug=slug).exists():
                slug = f"{base}-{get_random_string(6)}"
            validated_data["slug"] = slug

        listing = Listing.objects.create(**validated_data)

        # images
        try:
            labels = json.loads(image_labels_json)
        except Exception:
            labels = {}

        for i, img in enumerate(images_data):
            ListingImage.objects.create(
                listing=listing,
                image=img,
                label=labels.get(str(i)),
                order=i,
            )

        request = self.context["request"]

        # ----- OWNERSHIP -----
        ownership_files = docs_data["doc_ownership_1"] + docs_data["doc_ownership_2"]
        ownership_note = request.data.get("doc_ownership_note")

        for f in ownership_files:
            ListingDocument.objects.create(
                listing=listing,
                document_type=ListingDocument.DocumentType.OWNERSHIP,
                file=f,
                owner_note=ownership_note,
            )

        if not ownership_files and ownership_note:
            ListingDocument.objects.create(
                listing=listing,
                document_type=ListingDocument.DocumentType.OWNERSHIP,
                owner_note=ownership_note,
            )

        # ----- OTHER DOCS -----
        for field, doc_type in {
            "doc_identity": ListingDocument.DocumentType.IDENTITY,
            "doc_assurance": ListingDocument.DocumentType.ASSURANCE,
            "doc_register": ListingDocument.DocumentType.REGISTER,
            "doc_silbiya": ListingDocument.DocumentType.SILBIYA,
        }.items():
            files = docs_data.get(field, [])
            note = request.data.get(f"{field}_note")

            for f in files:
                ListingDocument.objects.create(
                    listing=listing,
                    document_type=doc_type,
                    file=f,
                    owner_note=note,
                )

            if not files and note:
                ListingDocument.objects.create(
                    listing=listing,
                    document_type=doc_type,
                    owner_note=note,
                )

        return listing


# ---------------- Listing (detail) ----------------
class ListingDetailSerializer(ListingSerializer):
    documents = ListingDocumentSerializer(many=True, read_only=True)

    class Meta(ListingSerializer.Meta):
        fields = ListingSerializer.Meta.fields + ["documents"]
