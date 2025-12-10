from django.urls import path
from .views import (
    FeaturedListingsView, ListingActivateView, ListingDocumentApproveView, RejectDocumentView, SearchListingsView, ListingCreateView, ListingDetailView,
    MyListingsView, ListingPauseView, ListingDocumentUpdateView,
    AdminListingListView, AdminListingApproveView, AdminListingRejectView, AdminListingViewDetailed, ListingViewDocuments
)

urlpatterns = [
    path('listings/featured/', FeaturedListingsView.as_view(), name='featured-listings'),
    path('listings/search/', SearchListingsView.as_view(), name='search-listings'),
    path('listings/create/', ListingCreateView.as_view(), name='create-listing'),
    path('listings/<int:id>/', ListingDetailView.as_view(), name='listing-detail'),
    path('listings/my-listings/', MyListingsView.as_view(), name='my-listings'),
    path('listings/<int:id>/pause/', ListingPauseView.as_view(), name='pause-listing'),
    path('listings/<int:id>/activate/', ListingActivateView.as_view(), name='activate-listing'),
    path('listings/<int:id>/documents/', ListingDocumentUpdateView.as_view(), name='update-documents'),

    # Admin URLs
    path('admin/listings/', AdminListingListView.as_view(), name='admin-listing-list'),
    path('admin/listings/<int:id>/approve/', AdminListingApproveView.as_view(), name='admin-approve-listing'),
    path('admin/listings/<int:id>/reject-anyways/', AdminListingRejectView.as_view(), name='admin-reject-listing'),
    #The get admin listing by detail!! I dont think it is implemented (10.2 in primary contract)
    path('admin/listings/<int:id>/', AdminListingViewDetailed.as_view(), name="admin-listing-detail"),

    #Gets you the id's documents
    path('listings/documents/<int:id>/fetch/', ListingViewDocuments.as_view(), name="get-listing-document"),

    path('/admin/listings/:id/documents/:docid/reject/', RejectDocumentView.as_view(), name="reject-doc"),
    path('/admin/listings/:id/documents/:docid/approve/', ListingDocumentApproveView.as_view(), name="reject-doc"),
    

]
