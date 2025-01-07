
from zango.core.utils import get_current_role

from ..packages.crud.base import BaseCrudView

from .forms import PaediatricianForm
from .models import Paediatrician
from .tables import PaediatricianCrudTable



class PaediatricianCrudView(BaseCrudView):
    page_title = "Paediatricians"
    add_btn_title = "Add New Paediatrician"
    table = PaediatricianCrudTable
    form = PaediatricianForm
    model = Paediatrician
    
    
    def display_add_button_check(self, request):
        return get_current_role().name in ['Admin']
    
    def can_perform_action_edit(self, request, obj):
        return get_current_role().name in ['Admin']

