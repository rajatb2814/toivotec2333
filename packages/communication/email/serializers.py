from rest_framework.serializers import ModelSerializer, SerializerMethodField, CharField

from .models import EmailModel, EmailConfigModel, EmailAttachment
from ..utils import process_timestamp


class EmailModelSerializer(ModelSerializer):
    attachments = SerializerMethodField("get_attachments")
    id = SerializerMethodField()
    status = SerializerMethodField()
    timestamp = SerializerMethodField()

    class Meta:
        model = EmailModel
        fields = [
            "id",
            "from_email",
            "to_email",
            "cc_email",
            "bcc_email",
            "subject",
            "email_body",
            "attachments",
            "timestamp",
            "status",
            "message_id"
        ]

    def get_timestamp(self, obj):
        return process_timestamp(obj.timestamp)

    def get_id(self, obj):
        return obj.id + 10000

    def get_attachments(self, obj):
        return EmailAttachmentSerializer(
            EmailAttachment.objects.filter(email=obj), many=True
        ).data

    def get_status(self, obj):
        if obj.status == "service_inactive":
            return "Service Inactive"
        return obj.status.capitalize()


class EmailConfigureSerializer(ModelSerializer):

    class Meta:
        model = EmailConfigModel
        fields = [
            "pk",
            "key",
            "from_email",
            "provider",
            "provider_package_name",
            "config",
            "is_default",
            "is_active",
        ]


class EmailAttachmentSerializer(ModelSerializer):
    class Meta:
        model = EmailAttachment
        fields = ["pk", "name", "file", "content_type"]
