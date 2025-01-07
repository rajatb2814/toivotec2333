from django.db import models
from zango.apps.dynamic_models.models import DynamicModelBase
from zango.apps.dynamic_models.fields import ZForeignKey

from ..clinics.models import Clinic

class Patient(DynamicModelBase):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')])
    clinic = ZForeignKey(Clinic, on_delete=models.CASCADE)
    parent_contact = models.CharField(max_length=255, blank=True, null=True)
    parent_email = models.EmailField()
    address = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


