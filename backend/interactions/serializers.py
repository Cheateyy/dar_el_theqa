from rest_framework import serializers
from .models import Favorite, Lead, Review
from listings.models import Listing  # import Listing model
from listings.serializers import ListingSerializer  # keep if you need the base ListingSerializer


class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ['id', 'listing']


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'user_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['user']



class OwnerLeadListSerializer(serializers.ModelSerializer):
    date = serializers.DateField(source='created_at', format='%Y-%m-%d')
    client_name = serializers.CharField(source='user.get_full_name')
    client_phone = serializers.CharField(source='user.phone')  
    listing_title = serializers.CharField(source='listing.title')
    listing_type = serializers.CharField(source='listing.property_type') 

    class Meta:
        model = Lead
        fields = ['id', 'date', 'client_name', 'client_phone', 'listing_id', 'listing_title', 'listing_type']


class LeadClientSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Lead
        fields = ['full_name', 'phone', 'email', 'message']

class LeadPropertySerializer(serializers.ModelSerializer):
    cover_image = serializers.ImageField(source='cover', read_only=True)  
    property_type = serializers.CharField(source='property_type') 

    class Meta:
        model = Listing
        fields = ['id', 'title', 'description', 'price', 'rent_unit', 'wilaya', 'region', 'area', 'bedrooms', 'bathrooms', 'cover_image', 'property_type']

class LeadDetailSerializer(serializers.ModelSerializer):
    client = LeadClientSerializer(source='*', read_only=True)
    property = LeadPropertySerializer(source='listing', read_only=True)
    date = serializers.DateField(source='created_at', format='%Y-%m-%d', read_only=True)

    class Meta:
        model = Lead
        fields = ['id', 'date', 'client', 'property']
