from django.db import models
from core.models import TimeStampedModel

class Wilaya(TimeStampedModel):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

class Region(TimeStampedModel):
    wilaya = models.ForeignKey(Wilaya, on_delete=models.CASCADE, related_name='regions')
    name = models.CharField(max_length=255)

    class Meta:
        unique_together = ('wilaya', 'name')

    def __str__(self):
        return f"{self.name}, {self.wilaya.name}"
