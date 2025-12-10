from django.db import models
from core.models import TimeStampedModel

class Favorite(TimeStampedModel):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='favorites')
    listing = models.ForeignKey('listings.Listing', on_delete=models.CASCADE, related_name='favorited_by')

    class Meta:
        unique_together = ('user', 'listing')

    def __str__(self):
        return f"{self.user} -> {self.listing}"

class Lead(TimeStampedModel):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='leads')
    listing = models.ForeignKey('listings.Listing', on_delete=models.CASCADE, related_name='leads')
    message = models.TextField()

    def __str__(self):
        return f"Lead from {self.user} on {self.listing}"

class Review(TimeStampedModel):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='reviews')
    listing = models.ForeignKey('listings.Listing', on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()

    def __str__(self):
        return f"Review {self.rating}/5 by {self.user} on {self.listing}"
