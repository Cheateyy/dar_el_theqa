from rest_framework import serializers
from .models import Favorite, Lead, Review
from listings.serializers import ListingSerializer

class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ['id', 'listing']

class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = ['id', 'listing', 'message']

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'user_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['user']
