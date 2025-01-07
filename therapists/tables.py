
from ..packages.crud.table.base import ModelTable
from ..packages.crud.table.column import ModelCol, StringCol

from .models import Therapist
from .forms import TherapistForm

class TherapistCrudTable(ModelTable):
    first_name = ModelCol(display_as="First Name", searchable=True, sortable=True)
    last_name = ModelCol(display_as="Last Name", searchable=True, sortable=True)
    email = ModelCol(display_as="Email", searchable=True, sortable=True)
    phone = ModelCol(display_as="Phone", searchable=True, sortable=True)
    clinic = ModelCol(display_as="Clinic", searchable=True, sortable=True)

    table_actions = [
    ]

    row_actions = [
        {
            "name": "Edit",
            "key": "edit",
            "description": "Edit",
            "type": "form",
            "form": TherapistForm,
        }
    ]

    class Meta:
        model = Therapist
        fields = ['first_name', 'last_name', 'email', 'phone', 'clinic']
        row_selector = {}

