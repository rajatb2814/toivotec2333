import json

from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.forms.models import model_to_dict

from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from django.db import IntegrityError

from zango.core.api import get_api_response

from ..sms.models import SmsConfigModel
from ..email.models import EmailConfigModel
from ..telephony.models import TelephonyConfigModel
from ..videocall.models import VideoCallConfigModel
from .models import CommmunicationActiveModel
from .serializers import (
    EmailConfigureSerializer,
    SmsConfigureSerializer,
    TelephonyConfigureSerializer,
    VideocallConfigureSerializer,
)


@method_decorator(csrf_exempt, name="dispatch")
class CommunicationConfigureView(TemplateView):
    template_name = "communication/configure.html"


SERVICE_MODEL_MAPPING = {
    "sms": SmsConfigModel,
    "email": EmailConfigModel,
    "telephony": TelephonyConfigModel,
    "videocall": VideoCallConfigModel,
}


class CommunicationConfigureAPIView(APIView):
    def get(self, request, *args, **kwargs):
        action = request.GET.get("action", "")
        if action == "fetch_configs":
            sms_objs = SmsConfigModel.objects.all().order_by("-modified_at")
            email_objs = EmailConfigModel.objects.all().order_by("-modified_at")
            telephony_objs = TelephonyConfigModel.objects.all().order_by("-modified_at")
            videocall_config_objs = VideoCallConfigModel.objects.all().order_by(
                "-modified_at"
            )
            active_status = CommmunicationActiveModel.objects.first()
            return get_api_response(
                True,
                {
                    "sms": {
                        "configs": SmsConfigureSerializer(sms_objs, many=True).data,
                        "active": active_status.sms,
                    },
                    "email": {
                        "configs": EmailConfigureSerializer(email_objs, many=True).data,
                        "active": active_status.email,
                    },
                    "telephony": {
                        "configs": TelephonyConfigureSerializer(
                            telephony_objs, many=True
                        ).data,
                    },
                    "ims": [],
                    "videocall": {
                        "configs": VideocallConfigureSerializer(
                            videocall_config_objs, many=True
                        ).data,
                    },
                },
                200,
            )
        elif action == "get_config":
            pk = request.GET.get("pk", None)
            type = request.GET.get("type", None)
            if type == "sms":
                config = SmsConfigModel.objects.get(pk=pk)
            elif type == "email":
                config = EmailConfigModel.objects.get(pk=pk)
            elif type == "telephony":
                config = TelephonyConfigModel.objects.get(pk=pk)
            elif type == "videocall":
                config = VideoCallConfigModel.objects.get(pk=pk)

            return get_api_response(True, config.config, 200)
        elif action == "get_active_status":
            active_status = CommmunicationActiveModel.objects.first()
            return get_api_response(True, model_to_dict(active_status), 200)
        return get_api_response(False, "Invalid action", 400)

    def update_key(self, type, key, active, pk):
        model = SERVICE_MODEL_MAPPING[type]
        obj = model.objects.get(pk=pk)
        obj.is_active = active
        obj.key = key
        obj.save()

    def make_default(self, type, pk):
        model = SERVICE_MODEL_MAPPING[type]
        try:
            obj = model.objects.get(is_default=True)
            obj.is_default = False
            obj.save()
        except model.DoesNotExist:
            pass
        obj = model.objects.get(pk=pk)
        obj.is_default = True
        obj.save()

    def post(self, request, *args, **kwargs):
        body = request.data
        action = request.GET.get("action", "")
        pk = request.GET.get("pk", None)
        if action == "update_key":
            _type = body.get("type")
            active = True if body.get("active") == "true" else False
            try:
                self.update_key(_type, body.get("key"), active, pk)
            except IntegrityError as e:
                return get_api_response(
                    False,
                    {"errors": {"__all__": {"__errors": ["Key already exists"]}}},
                    400,
                )
            return get_api_response(True, "Successfully Updated", 200)
        elif action == "make_default":
            _type = body.get("type")
            self.make_default(_type, pk)
            return get_api_response(True, "Successfully Updated", 200)
        elif action == "set_active":
            _type = body.get("type")
            active = True if body.get("active") == "true" else False
            config = CommmunicationActiveModel.objects.first()
            setattr(config, _type, active)
            config.save()
            return get_api_response(True, "Successfully Updated", 200)
        return get_api_response(False, "Invalid action", 400)
