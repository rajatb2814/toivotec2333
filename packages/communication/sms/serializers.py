from rest_framework.serializers import ModelSerializer, SerializerMethodField, CharField

from .models import SMSTransactionsModel, SmsConfigModel
from ..utils import process_timestamp


class SmsModelSerializer(ModelSerializer):
    id = SerializerMethodField()
    status = SerializerMethodField()
    date_sent = SerializerMethodField()

    class Meta:
        model = SMSTransactionsModel
        fields = [
            "id",
            "to_number",
            "src",
            "message",
            "date_sent",
            "status",
            "provider",
        ]

    def get_date_sent(self, obj):
        return process_timestamp(obj.date_sent)

    def get_id(self, obj):
        return obj.id + 10000

    def get_status(self, obj):
        if obj.status == "service_inactive":
            return "Service Inactive"
        return obj.status.capitalize()
