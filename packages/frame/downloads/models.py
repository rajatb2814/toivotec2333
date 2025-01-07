from django.db import models

from zango.apps.dynamic_models.models import DynamicModelBase
from zango.apps.dynamic_models.fields import ZForeignKey
from zango.apps.appauth.models import AppUserModel
from zango.core.storage_utils import ZFileField


class ExportJob(DynamicModelBase):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("processing", "Processing"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    ]

    EXPORT_TYPE_CHOICES = [
        ("xlsx", "Excel Export"),
        ("csv", "CSV Export"),
    ]

    filename = models.CharField(max_length=255, blank=True, null=True)
    file = ZFileField(blank=True, null=True)

    export_metadata = models.JSONField(blank=True, null=True)  # Store job metadata
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    export_type = models.CharField(max_length=20, choices=EXPORT_TYPE_CHOICES)
    celery_task_id = models.CharField(max_length=50, blank=True, null=True)
    user = ZForeignKey(AppUserModel, on_delete=models.PROTECT, blank=True, null=True)

    def __str__(self):
        return f"Download Job"
