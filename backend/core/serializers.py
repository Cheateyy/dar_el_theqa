from rest_framework import serializers
from .models import AuditLog

class AuditLogSerializer(serializers.ModelSerializer):
    admin_name = serializers.CharField(source='admin.get_full_name', read_only=True)

    class Meta:
        model = AuditLog
        fields = '__all__'
        read_only_fields = ['id', 'created_at'] ## id not needed in the request because I have overriden the create function
                                                ## in the view, so the user is directly ingected
