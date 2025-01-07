# Module Imports
import json

# Django Imports
from django.http import HttpResponse
from django.views.generic import TemplateView


class Profile360BaseView(TemplateView):
    
    template_name = "profile360/profile360_base.html"

    model = None


    def get_object(self, request):

        object = self.model.objects.get(object_uuid=self.kwargs['slug'])

        return object

    # crud_class = None # Attach your crud class here

    def parse_config_request(self, request, body, object):

        data = {
            "address": {
                "address_tab_label": "Addresses 123",
                "allow_create": False,
                "allow_edit": False,
                "allow_multiple": True,
                "enabled": False,
                "is_primary_label": "Same as Permanent"
            },
            "app_config": {
                "app_code": "norditropint015",
                "app_logo_url": "https://zc-6c128e77e5a548239a15-mb.s3.amazonaws.com/media/norditropint015/ClientConfigModel/be25887f-9341-4c07-ae26-ff530b433fa9.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=600&X-Amz-Credential=AKIARVJQHVRR5EBGPKPN%2F20241003%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-SignedHeaders=host&X-Amz-Date=20241003T061231Z&X-Amz-Signature=7c647827266f77eb033b05b1e117f44625360b8030dd10ce2a7912178c8f8b0b",
                "app_name": "NordiCare PSP",
                "app_url": "pspdemostage-zel-in.zelthy.in",
                "datetime_format": "%d %b %Y %I:%M %p",
                "language": None
            },
            "cta": {
                "cta_enabled": False,
                "options": [
                    {
                        "label": "Option 1",
                        "action": "Action 1",
                    }
                ]
            },
            "custom_tab": {
                "custom_tab_enabled": False
            },
            "iframe_tab": {
                "iframe_tab_enabled": True,
                "tabs":[
                    {
                        "key":"order",
                        "name":"Order",
                        "url":"http://app5.zelthy.com:8000/clinic_orders/consultation-orders/"
                    },
                    {
                        "key":"lab",
                        "name":"Lab",
                        "url":"https://chatgpt.com/"
                    }
                ]
            },
            "integrations": {
                "email": {
                    "enabled": False
                },
                "sms": {
                    "enabled": False
                },
                "telephony": {
                    "country_code": [
                        91
                    ],
                    "enabled": False
                },
                "video_call": {}
            },
            "notes": {
                "allow_create": True,
                "allow_edit": False,
                "enabled": True
            },
            "object_details": {
                "allow_edit": False,
                "enabled": False,
                "profile": {
                    "age_enabled": False,
                    "gender_enabled": False,
                    "name_enabled": False,
                    "phone_enabled": False,
                    "status_enabled": False,
                    "user_id_enabled": False
                }
            },
            "object_status": {
                "allow_edit": False,
                "enabled": False
            },
            "programs": {
                "can_apply": False,
                "component_enabled": False,
                "components": [
                    "Enrolled Programs",
                    "Eligible Programs"
                ],
                "enabled": False
            },
            "tags": {
                "allow_edit": False,
                "enabled": False,
                "mutually_exclusive": [],
                "options": []
            },
            "timeline_view": {
                "components": [
                    "Adverse Events",
                    "Calls",
                    "Email",
                    "SMS"
                ],
                "enabled": False
            }
        }

        return data, 200

    
    def parse_object_details_data(self, request, body, object):
        data = {
            "addresses": [
                {
                    "address": "test123, test123, Adilabad , Andhra Pradesh, 786756",
                    "id": 3,
                    "is_primary": True,
                    "name": "test123445"
                }
            ],
            "age": 35,
            "form_schema": [],
            "gender": "f",
            "id": 3,
            "name": "test123445",
            "object_details": [
                {
                    "title": "Date of Birth",
                    "value": "22 Sep 1989"
                },
                {
                    "title": "Caregiver Name",
                    "value": "testgu"
                },
                {
                    "title": "Guardian Name",
                    "value": "testgu"
                },
                {
                    "title": "Guardian Email",
                    "type": "Email",
                    "value": "test123445@gmail.com"
                },
                {
                    "title": "Caregiver Mobile Number",
                    "type": "Phone",
                    "url": "/call/originatecall/919975444567",
                    "value": "+919975444567"
                },
                {
                    "title": "Caregiver Email",
                    "type": "Email",
                    "value": "test123445@gmail.com"
                },
                {
                    "title": "City",
                    "value": "Adilabad , Andhra Pradesh"
                },
                {
                    "title": "Start Dosage",
                    "value": "100 MG per day"
                },
                {
                    "title": "Date of First Prescription",
                    "value": "29 Sep 2023"
                },
                {
                    "title": "Follow-up Dosage",
                    "value": "200 MG per day"
                },
                {
                    "title": "Permanent Address Line 1",
                    "value": "test123"
                },
                {
                    "title": "Permanent Address Line 2",
                    "value": "test123"
                },
                {
                    "title": "Permanent address pincode",
                    "value": "786756"
                }
            ],
            "primary_phone": "+919975444567",
            "primary_phone_url": "/call/placecall/3/primary_phone",
            "status": "Dropped Out",
            "status_style": None,
            "statuses": [
                {
                    "id": 2,
                    "label": "Dropped Out",
                    "style": None
                }
            ],
            "tags": [],
            "user_id": 10003
        }

        return data, 200


    def parse_timeline_view_data(self, request, body, object):
        
        data  = {
            "counts": {
                "Adverse Events": 0,
                "Calls": 0,
                "Email": 0,
                "SMS": 0,
                "Status": 0,
                "Tags": 0
            },
            "data": [],
            "page_length": 10,
            "page_number": 1,
            "total_objects": 0,
            "total_pages": 0
        }

        return data, 200


    def parse_programs_data(self, request, body, object):

        data = [
            {
                "label": "Enrolled Programs",
                "total_programs": [
                    {
                        "description": "Zelthy Program",
                        "dosage": 13000.0,
                        "enrolled_by": "",
                        "enrollment_date": "29 Sep 2023 05:46 PM",
                        "id": 3,
                        "program_name": "Zelthy Program",
                        "program_status": "Active",
                        "redirection_url": "/patient/program_instance/a383ddee-19b5-4647-aa1a-83406656f177"
                    }
                ],
                "type": "Enrolled"
            },
            {
                "label": "Eligible Programs",
                "total_programs": [
                    {
                        "apply_url": "/patient/program/apply/f27a2dd8-31f9-4cdd-a65a-48a61cc7357d/2/0/",
                        "id": 2,
                        "is_eligible": False,
                        "program_name": "Zelthy Program"
                    }
                ],
                "type": "Eligible"
            }
        ]

        return data, 200


    def parse_notes_data(self, request, body, object):
        
        data = [
            {
                "body": "Notes A",
                "created_at": "2024-08-12",
                "created_by": "Rajat",
                "file": None,
                "id": 10001,
                "title": ""
            }
        ]

        return data, 200



    def parse_add_notes(self, request, body, object):
        return {}, 200


    def parse_data_request(self, request, body, object):

        mapper = {
            'object_details_data': self.parse_object_details_data,
            'timeline_view_data': self.parse_timeline_view_data,
            'programs_data': self.parse_programs_data,
            'notes_data': self.parse_notes_data
        }

        return mapper[body['data_type']](request, body, object)


    def parse_add_data_request(self, request, body, object):

        mapper = {
            'note': self.parse_add_notes
        }

        return mapper[body['data_type']](request, body, object)


    def post(self, request, *args, **kwargs):
        try:
            body = json.loads(request.body)
        except:
            body = request.POST
        mapper = {
            'config': self.parse_config_request,
            'data': self.parse_data_request,
            'add_data': self.parse_add_data_request
        }
        object = self.get_object(request)
        result = mapper[body['request_type']](request, body, object)
        return HttpResponse(json.dumps(result[0]), status=result[1])
