
from zango.core.utils import get_current_role

from ..packages.crud.base import BaseCrudView

from .forms import PatientForm
from .models import Patient
from .tables import PatientCrudTable


from .workflow import PatientWorkflow
from ..packages.profile360.base.views import Profile360BaseView
from django.views.generic import View, TemplateView
from ..packages.crud.mixin import CrudRequestMixin


class PatientCrudView(BaseCrudView):
    page_title = "All Patients"
    add_btn_title = "New Patient"
    table = PatientCrudTable
    form = PatientForm
    model = Patient
    
    workflow = PatientWorkflow
    
    
    def display_add_button_check(self, request):
        return get_current_role().name in ['Therapist']
    
    def can_perform_action_edit(self, request, obj):
        return get_current_role().name in []



class PatientProfileView(Profile360BaseView):

    model = Patient


    def parse_config_request(self, request, body, object):
        
        data, status = super(PatientProfileView, self).parse_config_request(request, body, object)

        
        if request.is_secure():
            site = "https://" + request.META["HTTP_HOST"]
        else:
            site = "http://" + request.META["HTTP_HOST"]

        data['iframe_tab'] = {
            "iframe_tab_enabled": True,
                "tabs":[
                    {
                        "key":"ToivoTek IOT Feed",
                        "name":"ToivoTek IOT Feed",
                        "url": "/patients/patients/toivotek_iot_feed/" 
                    }
            ]
        }
        data['notes']={
            "allow_create": False,
            "allow_edit": False,
            "enabled": False
        }
        data["object_details"] = {
            "allow_edit": False,
            "enabled": True,
            "profile": {
                "age_enabled": True,
                "gender_enabled": True,
                "name_enabled": True,
                "phone_enabled": True,
                "user_id_enabled": True
            }
        }
        data['app_config'] = {
            "app_code": "Toivotec2333",
            "app_logo_url": "",
            "app_name": "ToivoTek Demo Platform",
            "app_url": "toivotect.zelthy.com",
            "datetime_format": "%d %b %Y %I:%M %p",
        }

        data['timeline_view'] = {
            "components": [
                "ToivoTek IOT Feed",
            ],
            "enabled": True
        }

        return data, status
    
    def parse_object_details_data(self, request, body, object):

        data, status = super(PatientProfileView, self).parse_object_details_data(request, body, object)

        data.update({
            # "age": int((datetime.today().date() - object.dob).days / 365) if object.dob else "NA",
            # "gender": gender_map[object.gender] if object.gender else "NA",
            "id": object.id,
            "name": object.first_name,
            # "primary_phone": str(object.primary_phone),
            # "user_id": object.id + 10000
        })

        object_details = [
            {
                'title': 'Name',
                'value': object.first_name + " " + object.last_name
            },
            {
                'title': 'DOB',
                'value': object.date_of_birth.strftime('%d %b %Y'),
            },
            # {
            #     'title': 'Gender',
            #     'value': object.gender
            # },
            {
                'title': 'Clinic',
                'value': object.clinic.clinic_name
            },
            {
                'title': 'Parent Email',
                'value': object.parent_email
            },
            {
                'title': 'Parent Contact',
                'value': object.parent_contact
            },
            {
                'title': 'Address',
                'value': object.address
            }
        ]

        data['object_details'] = object_details

        return data, status
    

class TivotecIOTFeed(TemplateView, CrudRequestMixin):

    template_name = "tivotec_iot_feed.html"