from typing import Optional

from rest_framework import serializers
from .models import Listing, ListingImage, ListingDocument
from users.serializers import PartnerSerializer
from locations.serializers import WilayaSerializer, RegionSerializer
from locations.models import Wilaya, Region
from django.utils.text import slugify
from django.utils.crypto import get_random_string
import json

class ListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = ['id', 'image', 'label', 'order']

class ListingDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingDocument
        #ADDED the return of the owner note
        fields = ['id', 'document_type', 'file', 'status', 'admin_note', 'owner_note'] ## <- HERE
        #gotta ask cheatyy for this: why are these down here read_only?
        read_only_fields = ['status', 'admin_note']

class ListingSerializer(serializers.ModelSerializer):
    wilaya_name = serializers.CharField(source='wilaya.name', read_only=True)
    region_name = serializers.CharField(source='region.name', read_only=True)
    cover_image = serializers.SerializerMethodField()
    partner = PartnerSerializer(read_only=True)
    images = ListingImageSerializer(many=True, read_only=True)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = [
            'id', 'slug', 'title', 'transaction_type', 'price', 'rent_unit',
            'wilaya', 'wilaya_name', 'region', 'region_name', 'cover_image',
            'verification_status', 'is_liked', 'partner', 'property_type',
            'area', 'bedrooms', 'bathrooms', 'floors', 'description',
            'address', 'rental_status', 'available_date', 'images', 'status',
            'rejection_reason', 'document_notes', 'created_at'
        ]

    def get_cover_image(self, obj) -> Optional[str]:
        first_image = obj.images.first()
        if first_image:
            return first_image.image.url
        return None

    def get_is_liked(self, obj) -> bool:
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favorited_by.filter(user=request.user).exists()
        return False

class ListingCreateSerializer(serializers.ModelSerializer):
    class FlexibleFileListField(serializers.ListField):
        def to_internal_value(self, data):
            if data is None:
                return []
            if not isinstance(data, (list, tuple)):
                data = [data]
            return super().to_internal_value(data)

    images = serializers.ListField(child=serializers.ImageField(), write_only=True, required=False)
    image_labels = serializers.CharField(write_only=True, required=False)

    # Frontend aliases (some pages send *_id / street_address)
    wilaya_id = serializers.IntegerField(write_only=True, required=False)
    region_id = serializers.IntegerField(write_only=True, required=False)
    street_address = serializers.CharField(write_only=True, required=False)

    # Notes about documents (even when a document is missing)
    document_notes = serializers.JSONField(required=False)
    
    # Documents
    doc_identity = FlexibleFileListField(child=serializers.FileField(), write_only=True, required=False)
    doc_assurance = FlexibleFileListField(child=serializers.FileField(), write_only=True, required=False)
    doc_ownership_1 = FlexibleFileListField(child=serializers.FileField(), write_only=True, required=False)
    doc_ownership_2 = FlexibleFileListField(child=serializers.FileField(), write_only=True, required=False)
    doc_register = FlexibleFileListField(child=serializers.FileField(), write_only=True, required=False)
    doc_silbiya = FlexibleFileListField(child=serializers.FileField(), write_only=True, required=False)

    # Frontend aliases for documents (no underscores)
    docidentity = FlexibleFileListField(child=serializers.FileField(), write_only=True, required=False)
    docassurance = FlexibleFileListField(child=serializers.FileField(), write_only=True, required=False)
    docownership1 = FlexibleFileListField(child=serializers.FileField(), write_only=True, required=False)
    docownership2 = FlexibleFileListField(child=serializers.FileField(), write_only=True, required=False)
    docownership3 = FlexibleFileListField(child=serializers.FileField(), write_only=True, required=False)
    docownership4 = FlexibleFileListField(child=serializers.FileField(), write_only=True, required=False)
    docownership5 = FlexibleFileListField(child=serializers.FileField(), write_only=True, required=False)
    docregister = FlexibleFileListField(child=serializers.FileField(), write_only=True, required=False)
    docsilbiya = FlexibleFileListField(child=serializers.FileField(), write_only=True, required=False)

    class Meta:
        model = Listing
        fields = [
            'title', 'transaction_type', 'property_type', 'price', 'wilaya', 'region',
            'address', 'area', 'bedrooms', 'bathrooms', 'floors', 'description',
            'document_notes',
            'images', 'image_labels',
            'wilaya_id', 'region_id', 'street_address',
            'doc_identity', 'doc_assurance', 'doc_ownership_1', 'doc_ownership_2',
            'doc_register', 'doc_silbiya',

            # Frontend alias document keys
            'docidentity', 'docassurance',
            'docownership1', 'docownership2', 'docownership3', 'docownership4', 'docownership5',
            'docregister', 'docsilbiya',
        ]

    def validate(self, attrs):
        # Map frontend aliases to model fields.
        if 'address' not in attrs and 'street_address' in attrs:
            attrs['address'] = attrs.pop('street_address')

        if 'wilaya' not in attrs and 'wilaya_id' in attrs:
            attrs['wilaya'] = Wilaya.objects.get(pk=attrs.pop('wilaya_id'))

        if 'region' not in attrs and 'region_id' in attrs:
            attrs['region'] = Region.objects.get(pk=attrs.pop('region_id'))

        return attrs

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        image_labels_json = validated_data.pop('image_labels', '{}')

        # Extract alias docs (frontend keys)
        alias_docs = {}
        for key in [
            'docidentity', 'docassurance', 'docownership1', 'docownership2', 'docownership3',
            'docownership4', 'docownership5', 'docregister', 'docsilbiya',
        ]:
            if key in validated_data:
                alias_docs[key] = validated_data.pop(key)
        
        # Extract documents
        docs_data = {}
        for key in ['doc_identity', 'doc_assurance', 'doc_ownership_1', 'doc_ownership_2', 'doc_register', 'doc_silbiya']:
            if key in validated_data:
                docs_data[key] = validated_data.pop(key)

        # Merge alias doc keys into canonical keys
        docs_data.setdefault('doc_identity', []).extend(alias_docs.get('docidentity', []))
        docs_data.setdefault('doc_assurance', []).extend(alias_docs.get('docassurance', []))
        docs_data.setdefault('doc_ownership_1', []).extend(alias_docs.get('docownership1', []))
        docs_data.setdefault('doc_ownership_2', []).extend(alias_docs.get('docownership2', []))
        docs_data.setdefault('doc_register', []).extend(alias_docs.get('docregister', []))
        docs_data.setdefault('doc_silbiya', []).extend(alias_docs.get('docsilbiya', []))
        # extra ownership pages also treated as OWNERSHIP
        docs_data.setdefault('doc_ownership_1', []).extend(alias_docs.get('docownership3', []))
        docs_data.setdefault('doc_ownership_1', []).extend(alias_docs.get('docownership4', []))
        docs_data.setdefault('doc_ownership_1', []).extend(alias_docs.get('docownership5', []))

        # Ensure slug exists (it is required by the model)
        if not validated_data.get('slug'):
            base_slug = slugify(validated_data.get('title') or '') or 'listing'
            candidate = base_slug
            while Listing.objects.filter(slug=candidate).exists():
                candidate = f"{base_slug}-{get_random_string(6)}"
            validated_data['slug'] = candidate

        listing = Listing.objects.create(**validated_data)

        # Handle Images
        try:
            labels_map = json.loads(image_labels_json)
        except:
            labels_map = {}

        for index, image in enumerate(images_data):
            label = labels_map.get(str(index))
            ListingImage.objects.create(listing=listing, image=image, label=label, order=index)

        # Handle Documents
        doc_type_map = {
            'doc_identity': ListingDocument.DocumentType.IDENTITY,
            'doc_assurance': ListingDocument.DocumentType.ASSURANCE,
            'doc_ownership_1': ListingDocument.DocumentType.OWNERSHIP,
            'doc_ownership_2': ListingDocument.DocumentType.OWNERSHIP,
            'doc_register': ListingDocument.DocumentType.REGISTER,
            'doc_silbiya': ListingDocument.DocumentType.SILBIYA,
        }

        for field_name, files in docs_data.items():
            doc_type = doc_type_map.get(field_name)
            for file in files:
                ListingDocument.objects.create(listing=listing, document_type=doc_type, file=file)

        return listing

class ListingDetailSerializer(ListingSerializer):
    documents = ListingDocumentSerializer(many=True, read_only=True)
    
    class Meta(ListingSerializer.Meta):
        fields = ListingSerializer.Meta.fields + ['documents']
