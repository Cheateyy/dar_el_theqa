from rest_framework import generics, views, permissions, status
from rest_framework.response import Response
from .models import Favorite, Lead, Review
from .serializers import FavoriteSerializer, LeadSerializer, ReviewSerializer
from listings.models import Listing
from listings.serializers import ListingSerializer

class FavoriteToggleView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, id):
        try:
            listing = Listing.objects.get(id=id)
            favorite, created = Favorite.objects.get_or_create(user=request.user, listing=listing)
            if not created:
                favorite.delete()
                return Response({"status": "removed", "message": "Removed from favorites"})
            return Response({"status": "added", "message": "Added to favorites"})
        except Listing.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class FavoriteListView(generics.ListAPIView):
    serializer_class = ListingSerializer # Returns full listing details
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Listing.objects.filter(favorited_by__user=self.request.user).order_by('-favorited_by__created_at')

class LeadCreateView(generics.CreateAPIView):
    serializer_class = LeadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        # Email logic would go here

class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        listing_id = self.kwargs.get('id')
        listing = Listing.objects.get(id=listing_id)
        
        # Check if user contacted the listing
        if not Lead.objects.filter(user=self.request.user, listing=listing).exists():
            raise serializers.ValidationError("You must contact the owner before reviewing.")
            
        serializer.save(user=self.request.user, listing=listing)

class ReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        listing_id = self.kwargs.get('id')
        return Review.objects.filter(listing_id=listing_id)
