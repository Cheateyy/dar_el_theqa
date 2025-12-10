from rest_framework import serializers
from .models import Listing, ListingImage, ListingDocument
from users.serializers import PartnerSerializer
from locations.serializers import WilayaSerializer, RegionSerializer
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
            'rejection_reason', 'created_at'
        ]

    def get_cover_image(self, obj):
        first_image = obj.images.first()
        if first_image:
            return first_image.image.url
        return None

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favorited_by.filter(user=request.user).exists()
        return False

class ListingCreateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(child=serializers.ImageField(), write_only=True, required=False)
    image_labels = serializers.CharField(write_only=True, required=False)
    
    # Documents
    doc_identity = serializers.ListField(child=serializers.FileField(), write_only=True, required=False)
    doc_assurance = serializers.ListField(child=serializers.FileField(), write_only=True, required=False)
    doc_ownership_1 = serializers.ListField(child=serializers.FileField(), write_only=True, required=False)
    doc_ownership_2 = serializers.ListField(child=serializers.FileField(), write_only=True, required=False)
    doc_register = serializers.ListField(child=serializers.FileField(), write_only=True, required=False)
    doc_silbiya = serializers.ListField(child=serializers.FileField(), write_only=True, required=False)

    class Meta:
        model = Listing
        fields = [
            'title', 'transaction_type', 'property_type', 'price', 'wilaya', 'region',
            'address', 'area', 'bedrooms', 'bathrooms', 'floors', 'description',
            'images', 'image_labels',
            'doc_identity', 'doc_assurance', 'doc_ownership_1', 'doc_ownership_2',
            'doc_register', 'doc_silbiya'
        ]

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        image_labels_json = validated_data.pop('image_labels', '{}')
        
        # Extract documents
        docs_data = {}
        for key in ['doc_identity', 'doc_assurance', 'doc_ownership_1', 'doc_ownership_2', 'doc_register', 'doc_silbiya']:
            if key in validated_data:
                docs_data[key] = validated_data.pop(key)

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
