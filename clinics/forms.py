
from ..packages.crud.forms import BaseForm, BaseSimpleForm
from ..packages.crud.form_fields import ModelField
from django import forms
from .models import Clinic
class ClinicForm(BaseForm):
    clinic_name = ModelField(placeholder="Clinic Name")
    address = ModelField(placeholder="Address")
    city = ModelField(placeholder="City")
    zip_code = ModelField(placeholder="Zip Code")
    contact_number = ModelField(placeholder="Contact Number")

    class Meta:
        model = Clinic
        title = "Add New Clinic"

        order = ['clinic_name', 'address', 'city', 'zip_code', 'contact_number']

