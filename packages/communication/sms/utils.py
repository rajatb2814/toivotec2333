import requests
import json
import traceback

from django.db import models

from zango.core.utils import get_package_url


from .models import SmsConfigModel, SMSTransactionsModel
from ..configure.models import CommmunicationActiveModel


class SMS:
    """
    SMS class to send SMS
    """

    def __init__(
        self, msg=None, destination=None, key=None, extra_data={}, *args, **kwargs
    ):
        self.msg = msg
        self.destination = destination
        self.key = key
        self.config = self.get_config()
        self.request = kwargs["request"]
        self.extra_data = extra_data

    def get_config(self):
        if not self.key:
            obj = SmsConfigModel.objects.get(is_default=True)
        else:
            obj = SmsConfigModel.objects.get(key=self.key)
        return obj

    def send_sms(self):
        communication_active = CommmunicationActiveModel.objects.first()
        obj = SMSTransactionsModel.objects.create(
            message=self.msg,
            to_number=self.destination,
            config=self.config,
            provider=self.config.provider,
            src=self.config.config.get("src", None),
        )
        data = {
            "msg": self.msg,
            "destination": self.destination,
            "config": self.config.config,
        }
        data.update(**self.extra_data)
        params = {"action": "send"}
        if not communication_active.sms:
            obj.status = "service_inactive"
            obj.save()
            return obj
        resp = requests.post(
            get_package_url(
                self.request,
                f"sms/api/?action=send",
                self.config.provider_package_name,
            ),
            params=params,
            data=json.dumps(data),
        )
        try:
            response = resp.json()["response"]
            obj.status = response["status"]
            obj.response_code = resp.status_code
            obj.response_text = json.dumps(response["data"])
            obj.save()
            return obj
        except Exception as e:
            obj.status = "failed"
            obj.response_code = resp.status_code
            obj.response_text = traceback.format_exc()
            obj.save()
            return obj
