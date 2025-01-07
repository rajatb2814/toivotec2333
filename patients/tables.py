
from zango.core.utils import get_current_request, get_current_role

from ..packages.crud.table.base import ModelTable
from ..packages.crud.table.column import ModelCol, StringCol

from .models import Patient
from .forms import PatientForm
from ..clinics.models import Clinic
from ..therapists.models import Therapist
from ..paediatricians.models import Paediatrician
from .details import PatientDetail

class PatientCrudTable(ModelTable):
    first_name = ModelCol(display_as="First Name", searchable=True, sortable=True)
    last_name = ModelCol(display_as="Last Name", searchable=True, sortable=True)
    date_of_birth = ModelCol(display_as="Date Of Birth", searchable=True, sortable=True)
    gender = ModelCol(display_as="Gender", searchable=True, sortable=True)
    clinic = ModelCol(display_as="Clinic", searchable=True, sortable=True)
    parent_contact = ModelCol(display_as="Parent Contact", searchable=True, sortable=True)
    parent_email = ModelCol(display_as="Parent Email", searchable=True, sortable=True)
    address = ModelCol(display_as="Address", searchable=True, sortable=True)

    table_actions = [
    ]

    row_actions = [
        {
            "name": "Edit",
            "key": "edit",
            "description": "Edit",
            "type": "form",
            "form": PatientForm,
        }
    ]
    

    class Meta:
        model = Patient
        detail_class = PatientDetail
        fields = ['first_name', 'last_name', 'date_of_birth', 'gender', 'clinic', 'parent_contact', 'parent_email', 'address']
        row_selector = {}

    def get_table_data_queryset(self):
        queryset = super().get_table_data_queryset()

        current_role = get_current_role()
        if current_role.name in ["Therapist", "Paediatrician"]:
            current_user = get_current_request().user
            if current_role.name == "Therapist":
                therapist = Therapist.objects.get(email=current_user.email)
                return queryset.filter(clinic=therapist.clinic)
            elif current_role.name == "Paediatrician":
                paediatrician = Paediatrician.objects.get(email=current_user.email)
                return queryset.filter(clinic=paediatrician.clinic)
        return queryset

    def get_detail_url(self, request, obj):
        return f"/patients/patients/profile/{obj.object_uuid}" # URL should have a / in the beginning


