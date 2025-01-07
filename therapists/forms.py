
from ..packages.crud.forms import BaseForm, BaseSimpleForm
from ..packages.crud.form_fields import ModelField
from django import forms
from .models import Therapist
from zango.core.utils import get_current_role

class TherapistForm(BaseForm):
    first_name = ModelField(placeholder="First Name")
    last_name = ModelField(placeholder="Last Name")
    email = ModelField(placeholder="Email")
    phone = ModelField(placeholder="Phone")
    clinic = ModelField(placeholder="Clinic")

    class Meta:
        model = Therapist
        title = "Add New Therapist"
        order = ['first_name', 'last_name', 'email', 'phone', 'clinic']

    def save(self, commit=True):
        instance = super(TherapistForm, self).save(commit=True)

        instance.create_app_user(
            name=f"{instance.first_name} {instance.last_name}",
            email=instance.email,
            mobile=instance.phone or "",
            password="Zango@123",
            role_name="Therapist"
        )

        return instance


