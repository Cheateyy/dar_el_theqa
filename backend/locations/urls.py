from django.urls import path
from .views import WilayaListView, RegionListView

urlpatterns = [
    path('choices/wilayas/', WilayaListView.as_view(), name='wilaya-list'),
    path('choices/regions/', RegionListView.as_view(), name='region-list'),
]
