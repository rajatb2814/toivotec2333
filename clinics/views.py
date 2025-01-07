
from zango.core.utils import get_current_role

from ..packages.crud.base import BaseCrudView

from .forms import ClinicForm
from .models import Clinic
from .tables import ClinicCrudTable



class ClinicCrudView(BaseCrudView):
    page_title = "All Clinics"
    add_btn_title = "Add New Clinic"
    table = ClinicCrudTable
    form = ClinicForm
    model = Clinic
    
    
    def display_add_button_check(self, request):
        return get_current_role().name in ['Admin']
    
    def can_perform_action_edit(self, request, obj):
        return get_current_role().name in ['Admin']

