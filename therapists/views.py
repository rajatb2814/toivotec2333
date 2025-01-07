
from zango.core.utils import get_current_role

from ..packages.crud.base import BaseCrudView

from .forms import TherapistForm
from .models import Therapist
from .tables import TherapistCrudTable



class TherapistCrudView(BaseCrudView):
    page_title = "All Therapists"
    add_btn_title = "Add New"
    table = TherapistCrudTable
    form = TherapistForm
    model = Therapist
    
    
    def display_add_button_check(self, request):
        return get_current_role().name in ['Admin']
    
    def can_perform_action_edit(self, request, obj):
        return get_current_role().name in ['Admin']

