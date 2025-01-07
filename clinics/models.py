from django.db import models
from zango.apps.dynamic_models.models import DynamicModelBase

class Clinic(DynamicModelBase):
    clinic_name = models.CharField(max_length=255, unique=True)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    zip_code = models.CharField(max_length=20)
    contact_number = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.clinic_name


