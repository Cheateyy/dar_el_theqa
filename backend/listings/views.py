from rest_framework import generics, views, permissions, status, filters, serializers
from rest_framework.response import Response
from django.db.models import Q
from django.shortcuts import get_object_or_404
from .models import Listing, ListingDocument
from .serializers import ListingSerializer, ListingCreateSerializer, ListingDetailSerializer, ListingDocumentSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404


from drf_spectacular.utils import extend_schema, inline_serializer

class FeaturedListingsView(generics.ListAPIView):
    serializer_class = ListingSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Listing.objects.filter(status=Listing.Status.APPROVED)[:6] # Example limit

class SearchListingsView(views.APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=inline_serializer(
            name="ListingSearchRequest",
            fields={
                "wilaya_id": serializers.IntegerField(required=False),
                "transaction_type": serializers.CharField(required=False),
                "property_type": serializers.CharField(required=False),
                "price_min": serializers.DecimalField(max_digits=14, decimal_places=2, required=False),
                "price_max": serializers.DecimalField(max_digits=14, decimal_places=2, required=False),
                "is_verified_only": serializers.BooleanField(required=False),
                "page": serializers.IntegerField(required=False),
            },
        ),
        responses=inline_serializer(
            name="ListingSearchResponse",
            fields={
                "count": serializers.IntegerField(),
                "results": ListingSerializer(many=True),
            },
        ),
    )
    def post(self, request):
        data = request.data
        queryset = Listing.objects.filter(status=Listing.Status.APPROVED)

        # Filters
        if data.get('wilaya_id'):
            queryset = queryset.filter(wilaya_id=data['wilaya_id'])
        if data.get('transaction_type'):
            queryset = queryset.filter(transaction_type=data['transaction_type'])
        if data.get('property_type'):
            queryset = queryset.filter(property_type=data['property_type'])
        if data.get('price_min'):
            queryset = queryset.filter(price__gte=data['price_min'])
        if data.get('price_max'):
            queryset = queryset.filter(price__lte=data['price_max'])
        if data.get('is_verified_only'):
            queryset = queryset.filter(verification_status=Listing.VerificationStatus.VERIFIED)
        
        # Pagination (Simple implementation)
        page = data.get('page', 1)
        # ... pagination logic ...

        serializer = ListingSerializer(queryset, many=True, context={'request': request})
        return Response({
            "count": queryset.count(),
            "results": serializer.data
        })

class ListingCreateView(generics.CreateAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingCreateSerializer
    #permission_classes = [permissions.IsAuthenticated]
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class ListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingDetailSerializer
    permission_classes = [permissions.AllowAny] # Logic handles specific permissions
    lookup_field = 'id'

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ListingCreateSerializer
        return ListingDetailSerializer

class MyListingsView(generics.ListAPIView):
    serializer_class = ListingSerializer
    #permission_classes = [permissions.IsAuthenticated]
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Listing.objects.filter(owner=self.request.user)
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        return queryset

class ListingPauseView(views.APIView):
    #permission_classes = [permissions.IsAuthenticated]
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=inline_serializer(
            name="ListingPauseRequest",
            fields={"reason": serializers.CharField()},
        ),
        responses=inline_serializer(
            name="ListingPauseResponse",
            fields={
                "status": serializers.CharField(),
                "new_status": serializers.CharField(),
            },
        ),
    )
    def post(self, request, id):
        try:
            listing = Listing.objects.get(id=id, owner=request.user)
            reason = request.data.get('reason')
            if reason == 'RENTED':
                listing.status = Listing.Status.RENTED
            else:
                listing.status = Listing.Status.INACTIVE
            listing.save()
            return Response({"status": "success", "new_status": listing.status})
        except Listing.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        ### IM TRYING TO PUSH AND GIT IS TELLING ME EVERYTHING IS UP TO DATE!!! BUT IN GITHUB THERE IS NO CHANGE!!! TRYING TO ADD THIS COMMENT MAYBE IT SENCES A CHANGE AND ACTUALLY PUSHED THIS!!!!
class ListingActivateView(views.APIView):
    #permission_classes = [permissions.IsAuthenticated]
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=None,
        responses=inline_serializer(
            name="ListingActivateResponse",
            fields={
                "status": serializers.CharField(required=False),
            },
        ),
    )
    def post(self, request, id):
        try:
            listing = Listing.objects.get(id=id, owner=request.user)
            listing.status = Listing.Status.APPROVED
            listing.save()
            return Response({"status": "APPROVED"}, status=200)
        except Listing.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)



class ListingDocumentUpdateView(views.APIView):
    #permission_classes = [permissions.IsAuthenticated]
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    @extend_schema(
        request=None,
        responses=inline_serializer(
            name="ListingDocumentUpdateResponse",
            fields={
                "status": serializers.CharField(),
                "new_listing_status": serializers.CharField(),
            },
        ),
    )
    def patch(self, request, id):
        try:
            listing = Listing.objects.get(id=id, owner=request.user)
            # Logic to update specific documents
            # ...
            listing.status = Listing.Status.PENDING # Reset status
            listing.save()
            return Response({"status": "success", "new_listing_status": "PENDING"})
        except Listing.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class SimilarListingsView(generics.ListAPIView):
    serializer_class = ListingSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        base_listing = get_object_or_404(Listing, id=self.kwargs.get('id'))
        queryset = Listing.objects.filter(status=Listing.Status.APPROVED).exclude(id=base_listing.id)
        if base_listing.property_type:
            queryset = queryset.filter(property_type=base_listing.property_type)
        return queryset.order_by('?')[:3]


# Admin Views
class AdminListingListView(generics.ListAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    #permission_classes = [permissions.IsAdminUser]
    permission_classes = [permissions.AllowAny]

#10.2
class AdminListingViewDetailed(generics.RetrieveAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    #permission_classes = [permissions.IsAdminUser]
    permission_classes = [permissions.AllowAny]
    lookup_field = "id"


class AdminListingViewDetailed(generics.RetrieveDestroyAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = "id"

    def delete(self, request, *args, **kwargs):
        listing = self.get_object()
        listing.delete()
        return Response({"status": "DELETED"}, status=status.HTTP_200_OK)
        

class AdminListingApproveView(views.APIView):
    #permission_classes = [permissions.IsAdminUser]
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=None,
        responses=inline_serializer(
            name="AdminListingApproveResponse",
            fields={"status": serializers.CharField()},
        ),
    )
    def post(self, request, id):
        try:
            listing = Listing.objects.prefetch_related('documents').get(id=id)
            listing.status = Listing.Status.APPROVED
            listing.save()
        except Listing.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        documents = listing.documents.all()

        # If there are no documents, you may want to decide how to handle this
        if not documents.exists():
            listing.verification_status = Listing.VerificationStatus.PARTIAL

            listing.save()
            return Response({"status": listing.verification_status})

        approved_docs = documents.filter(status=ListingDocument.Status.APPROVED).count()
        total_docs = documents.count()

        if approved_docs == total_docs:
            listing.verification_status = Listing.VerificationStatus.VERIFIED
        else:
            listing.verification_status = Listing.VerificationStatus.PARTIAL

        listing.save()

        return Response({"status": listing.verification_status})
    


class AdminListingRejectView(views.APIView):
    #permission_classes = [permissions.IsAdminUser]
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=inline_serializer(
            name="AdminListingRejectRequest",
            fields={"reason": serializers.CharField(allow_blank=True, required=False)},
        ),
        responses=inline_serializer(
            name="AdminListingRejectResponse",
            fields={"status": serializers.CharField()},
        ),
    )
    def post(self, request, id):
        try:
            listing = Listing.objects.get(id=id)
            listing.status = Listing.Status.REJECTED
            listing.rejection_reason = request.data.get('reason')
            listing.save()
            return Response({"status": "REJECTED"})
        except Listing.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

#used by both admins and users
class ListingViewDocuments(generics.ListAPIView):
    serializer_class = ListingDocumentSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        listing_id = self.kwargs.get('id')
        return ListingDocument.objects.filter(listing_id=listing_id)



class RejectDocumentView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, listing_id, document_id):
        document = get_object_or_404(
            ListingDocument,
            id=document_id,
            listing_id=listing_id
        )

        document.status = ListingDocument.Status.REJECTED

        admin_note = request.data.get("reason", "Document rejected.")
        document.admin_note = admin_note

        document.save()

        return Response(
            {
                "reason": admin_note,
                "admin_note": admin_note,
                "status": "REJECTED",
                "message": "Document rejected",
                "doc_id": document_id,
            },
            status=status.HTTP_200_OK
        )


class ListingDocumentApproveView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, listing_id, document_id):
        document = get_object_or_404(
            ListingDocument,
            id=document_id,
            listing_id=listing_id
        )

        document.status = ListingDocument.Status.APPROVED
        admin_note = request.data.get("reason", "doc approved")

        if admin_note:
            document.admin_note = admin_note

        document.save()

        return Response(
            {
                "message": "Document approved successfully.",
                "doc_id": ListingDocumentSerializer(document).data["id"],
                "status": "APPROVED",
                "admin_note": admin_note,
            },
            
            status=status.HTTP_200_OK
        )

