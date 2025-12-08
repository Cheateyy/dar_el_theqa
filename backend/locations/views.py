from rest_framework import generics, permissions
from .models import Wilaya, Region
from .serializers import WilayaSerializer, RegionSerializer

class WilayaListView(generics.ListAPIView):
    queryset = Wilaya.objects.all()
    serializer_class = WilayaSerializer
    permission_classes = [permissions.AllowAny]

class RegionListView(generics.ListAPIView):
    serializer_class = RegionSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        wilaya_id = self.request.query_params.get('wilaya_id')
        if wilaya_id:
            return Region.objects.filter(wilaya_id=wilaya_id)
        return Region.objects.none()
