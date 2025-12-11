from rest_framework import generics, views, permissions, status, serializers
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .models import Favorite, Lead, Review
from .serializers import FavoriteSerializer, LeadSerializer, ReviewSerializer, OwnerLeadListSerializer, LeadDetailSerializer
from listings.models import Listing
from listings.serializers import ListingSerializer
from drf_spectacular.utils import extend_schema, inline_serializer
from django.db.models import Avg, Count
from django.shortcuts import get_object_or_404

class FavoriteToggleView(views.APIView):
    #permission_classes = [permissions.IsAuthenticated]
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=None,
        responses=inline_serializer(
            name="FavoriteToggleResponse",
            fields={
                "status": serializers.CharField(),
                "message": serializers.CharField(),
            },
        ),
    )
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




class ReviewListView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        listing_id = self.kwargs.get('id')
        return Review.objects.filter(listing_id=listing_id).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        aggregates = queryset.aggregate(avg=Avg('rating'), total=Count('id'))
        return Response({
            "average_rating": round(aggregates['avg'], 2) if aggregates['avg'] else 0.0,
            "total_reviews": aggregates['total'],
            "reviews": serializer.data,
        })

    def perform_create(self, serializer):
        listing_id = self.kwargs.get('id')
        listing = get_object_or_404(Listing, id=listing_id)

        if not Lead.objects.filter(user=self.request.user, listing=listing).exists():
            raise serializers.ValidationError("You must contact the owner before reviewing.")

        serializer.save(user=self.request.user, listing=listing)


class AdminReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        listing_id = self.kwargs.get('id')
        return Review.objects.filter(listing_id=listing_id).order_by('-created_at')


class AdminDeleteReviewView(generics.DestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_url_kwarg = "id"

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"review_id": kwargs["id"], "status": "Deleted"}, status=status.HTTP_200_OK)
