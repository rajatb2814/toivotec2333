
from ..packages.crud.detail.base import BaseDetail
from ..packages.crud.table.column import ModelCol

class PatientDetail(BaseDetail):
    first_name = ModelCol(display_as="First Name")
    last_name = ModelCol(display_as="Last Name")
    date_of_birth = ModelCol(display_as="Date Of Birth")
    gender = ModelCol(display_as="Gender")
    clinic = ModelCol(display_as="Clinic")
    parent_contact = ModelCol(display_as="Parent Contact")
    parent_email = ModelCol(display_as="Parent Email")
    address = ModelCol(display_as="Address")

    class Meta:
        fields = ['first_name', 'last_name', 'date_of_birth', 'gender', 'clinic', 'parent_contact', 'parent_email', 'address']

