from django.db import models
from zango.apps.dynamic_models.models import DynamicModelBase
from zango.apps.dynamic_models.fields import ZForeignKey
from ..clinics.models import Clinic

class Paediatrician(DynamicModelBase):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=255, blank=True, null=True)
    qualification = models.CharField(max_length=255)
    clinic = ZForeignKey(Clinic, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


