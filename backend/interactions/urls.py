from django.urls import path
from .views import FavoriteToggleView, FavoriteListView, LeadCreateView, ReviewCreateView, ReviewListView, AdminDeleteReviewView, AdminReviewListView, OwnerLeadListView, LeadDetailView

urlpatterns = [
    path('listings/<int:id>/favorite/', FavoriteToggleView.as_view(), name='favorite-toggle'),
    path('listings/favorites/', FavoriteListView.as_view(), name='favorite-list'),

    path('listings/<int:id>/interest/', LeadCreateView.as_view(), name='lead-create'),
    path('vendor/leads/<int:id>/', OwnerLeadListView.as_view(), name='owner-leads'), # get leads
    path('leads/<int:lead_id>/', LeadDetailView.as_view(), name='lead-detail'), # detail on lead



    path('listings/<int:id>/reviews/', ReviewListView.as_view(), name='review-list'),
    #admin doesnt get just three, admins get to see all of the reviews
    path('listings/admin/<int:id>/reviews/', AdminReviewListView.as_view(), name='review-list'),

    path('listings/<int:id>/reviews/create/', ReviewCreateView.as_view(), name='review-create'),

    #Admin can Delete Review (10.7 DELETE) "I do not think it is implemented"
    path('admin/reviews/<int:id>/delete', AdminDeleteReviewView.as_view(), name='review-delete'),
]
