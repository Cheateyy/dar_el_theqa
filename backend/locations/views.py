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

from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

# Mock Data
MOCK_WILAYAS = [
    {"id": 1, "name": "Algiers"},
    {"id": 2, "name": "Oran"},
    {"id": 3, "name": "Constantine"},
]

MOCK_REGIONS = {
    1: [  # Regions of Algiers
        {"id": 1, "name": "Bab El Oued"},
        {"id": 2, "name": "Hydra"},
        {"id": 3, "name": "El Harrach"},
    ],
    2: [  # Regions of Oran
        {"id": 4, "name": "Es Senia"},
        {"id": 5, "name": "Bir El Djir"},
    ],
    3: [  # Regions of Constantine
        {"id": 6, "name": "El Khroub"},
        {"id": 7, "name": "Didouche Mourad"},
    ],
}

# Views
class WilayaListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response(MOCK_WILAYAS)


class RegionListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        wilaya_id = request.query_params.get("wilaya_id")
        if wilaya_id:
            try:
                wilaya_id = int(wilaya_id)
                return Response(MOCK_REGIONS.get(wilaya_id, []))
            except ValueError:
                pass
        return Response([])
