from django.urls import path
from .views import FavoriteToggleView, FavoriteListView, LeadCreateView, ReviewCreateView, ReviewListView

urlpatterns = [
    path('listings/<int:id>/favorite/', FavoriteToggleView.as_view(), name='favorite-toggle'),
    path('listings/favorites/', FavoriteListView.as_view(), name='favorite-list'),
    path('listings/<int:id>/interest/', LeadCreateView.as_view(), name='lead-create'),
    path('listings/<int:id>/reviews/', ReviewListView.as_view(), name='review-list'),
    path('listings/<int:id>/reviews/create/', ReviewCreateView.as_view(), name='review-create'),
]
