from rest_framework.serializers import ModelSerializer, SerializerMethodField
from rest_framework import serializers

from zango.apps.appauth.models import AppUserModel

from .models import TelephonyAgent, CallRecordModel


class TelephonyAgentSerializer(ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = TelephonyAgent
        fields = ["pk", "config", "user", "is_active", "provider"]

    def get_user(self, obj):
        return AppUserModel.objects.get(pk=obj.user.pk).name


class AppUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUserModel
        fields = ["pk", "name"]


class CallRecordSerializer(ModelSerializer):
    agentId = SerializerMethodField()
    id = SerializerMethodField()

    class Meta:
        model = CallRecordModel
        fields = [
            "id",
            "destination_number",
            "agentId",
            "call_duration",
            "call_type",
            "start_time",
            "call_type",
            "call_record_url",
        ]

    def get_agentId(self, obj):
        return obj.agent.config.get("agentId", "")

    def get_id(self, obj):
        return obj.id + 10000
