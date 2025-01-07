import uuid
import requests
import json

from django.db import models, connection
from django.contrib.postgres.fields import JSONField

from zango.apps.dynamic_models.models import DynamicModelBase
from zango.apps.dynamic_models.fields import ZForeignKey
from zango.core.storage_utils import ZFileField

from ..utils import DefaultConfigKeyMixin


class SmsConfigModel(DefaultConfigKeyMixin, DynamicModelBase):
    key = models.CharField(max_length=100, unique=True, blank=True)
    icon = ZFileField(upload_to="icons/", blank=True, null=True)
    provider = models.CharField(max_length=100)
    provider_package_name = models.CharField(max_length=100)
    config = JSONField(verbose_name="Config")
    is_default = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.provider


class SMSTransactionsModel(DynamicModelBase):
    uuid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    to_number = models.CharField(max_length=20, verbose_name="Recipient Phone Number")
    src = models.CharField(max_length=20, verbose_name="Source", null=True)
    message = models.TextField(verbose_name="Message Content")
    date_sent = models.DateTimeField(auto_now_add=True, verbose_name="Date Sent")
    config = ZForeignKey(
        SmsConfigModel, on_delete=models.PROTECT, verbose_name="Config"
    )
    status = models.CharField(max_length=50, verbose_name="Status")
    provider = models.CharField(max_length=255, verbose_name="Provider", null=True)
    response_code = models.CharField(
        max_length=100, verbose_name="Response Code", null=True
    )
    response_text = models.TextField(verbose_name="Response Text", null=True)
    delivery_exception = models.TextField(verbose_name="Delivery Exception", null=True)

    def __str__(self):
        return str(self.id)
