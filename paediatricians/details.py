
from ..packages.crud.detail.base import BaseDetail
from ..packages.crud.table.column import ModelCol

class PaediatricianDetail(BaseDetail):
    first_name = ModelCol(display_as="First Name")
    last_name = ModelCol(display_as="Last Name")
    email = ModelCol(display_as="Email")
    phone = ModelCol(display_as="Phone")
    qualification = ModelCol(display_as="Qualification")
    clinic = ModelCol(display_as="Clinic")

    class Meta:
        fields = ['first_name', 'last_name', 'email', 'phone', 'qualification', 'clinic']

