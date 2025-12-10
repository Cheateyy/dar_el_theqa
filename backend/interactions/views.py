from backend.core import serializers
from rest_framework import generics, views, permissions, status
from rest_framework.response import Response
from .models import Favorite, Lead, Review
from .serializers import FavoriteSerializer, LeadSerializer, ReviewSerializer, OwnerLeadListSerializer, LeadDetailSerializer
from listings.models import Listing
from listings.serializers import ListingSerializer

class FavoriteToggleView(views.APIView):
    #permission_classes = [permissions.IsAuthenticated]
    permission_classes = [permissions.AllowAny]

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
    #permission_classes = [permissions.IsAuthenticated]
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Listing.objects.filter(favorited_by__user=self.request.user).order_by('-favorited_by__created_at')

class LeadCreateView(generics.CreateAPIView):
    serializer_class = LeadSerializer
    #permission_classes = [permissions.IsAuthenticated]
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        # Email logic would go here

# gets all the generic info about all the account's leads
class OwnerLeadPagination(PageNumberPagination):
    page_size = 10  # default items per page
    page_size_query_param = 'page_size'

# ----------------------------
class OwnerLeadListView(generics.ListAPIView):
    serializer_class = OwnerLeadListSerializer
    #permission_classes = [permissions.IsAuthenticated]
    permission_classes = [permissions.AllowAny]
    pagination_class = OwnerLeadPagination

    def get_queryset(self):
        # Only leads for listings owned by the current user
        return Lead.objects.filter(listing__user=self.request.user).order_by('-created_at')

# ----------------------------
class LeadDetailView(generics.RetrieveAPIView):
    serializer_class = LeadDetailSerializer
    #permission_classes = [permissions.IsAuthenticated]
    permission_classes = [permissions.AllowAny]
    lookup_url_kwarg = 'lead_id'

    def get_queryset(self):
        # Only allow leads for listings owned by current user
        return Lead.objects.filter(listing__user=self.request.user)




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
        return Review.objects.filter(listing_id=listing_id)[0:3] ## just like setting the limit to 3 "as garamida requested"
    
class AdminReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        listing_id = self.kwargs.get('id')
        return Review.objects.filter(listing_id=listing_id)
    
    
    ##(10.7 deletes and returns as the contract)
class AdminDeleteReviewView(generics.DestroyAPIView):
    queryset = Review.objects.all()
    permission_classes = [permissions.IsAdminUser]
    lookup_url_kwarg = "review_id"

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"review_id":kwargs["review_id"],"status": "Deleted"}, status=status.HTTP_200_OK)
