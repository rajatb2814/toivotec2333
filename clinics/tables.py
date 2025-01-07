
from ..packages.crud.table.base import ModelTable
from ..packages.crud.table.column import ModelCol, StringCol

from .models import Clinic
from .forms import ClinicForm

class ClinicCrudTable(ModelTable):
    clinic_name = ModelCol(display_as="Clinic Name", searchable=True, sortable=True)
    address = ModelCol(display_as="Address", searchable=True, sortable=True)
    city = ModelCol(display_as="City", searchable=True, sortable=True)
    zip_code = ModelCol(display_as="Zip Code", searchable=True, sortable=True)
    contact_number = ModelCol(display_as="Contact Number", searchable=True, sortable=True)

    table_actions = [
    ]

    row_actions = [
        {
            "name": "Edit",
            "key": "edit",
            "description": "Edit",
            "type": "form",
            "form": ClinicForm,
        }
    ]

    class Meta:
        model = Clinic
        fields = ['clinic_name', 'address', 'city', 'zip_code', 'contact_number']
        row_selector = {}

