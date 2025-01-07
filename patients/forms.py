
from ..packages.crud.forms import BaseForm, BaseSimpleForm
from ..packages.crud.form_fields import ModelField
from django import forms
from .models import Patient
class PatientForm(BaseForm):
    first_name = ModelField(placeholder="First Name")
    last_name = ModelField(placeholder="Last Name")
    date_of_birth = ModelField(placeholder="Date Of Birth")
    gender = ModelField(placeholder="Gender")
    clinic = ModelField(placeholder="Clinic")
    parent_contact = ModelField(placeholder="Parent Contact")
    parent_email = ModelField(placeholder="Parent Email")
    address = ModelField(placeholder="Address")

    class Meta:
        model = Patient
        title = "Register New Patient"

        order = ['first_name', 'last_name', 'date_of_birth', 'gender', 'clinic', 'parent_contact', 'parent_email', 'address']

