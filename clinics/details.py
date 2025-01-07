
from ..packages.crud.detail.base import BaseDetail
from ..packages.crud.table.column import ModelCol

class ClinicDetail(BaseDetail):
    clinic_name = ModelCol(display_as="Clinic Name")
    address = ModelCol(display_as="Address")
    city = ModelCol(display_as="City")
    zip_code = ModelCol(display_as="Zip Code")
    contact_number = ModelCol(display_as="Contact Number")

    class Meta:
        fields = ['clinic_name', 'address', 'city', 'zip_code', 'contact_number']

