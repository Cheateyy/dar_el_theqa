from rest_framework import serializers
from .models import Wilaya, Region

class WilayaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wilaya
        fields = ['id', 'name']

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ['id', 'name']
