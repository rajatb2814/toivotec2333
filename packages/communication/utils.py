import uuid
import phonenumbers
from django.conf import settings

from zango.core.utils import get_datetime_str_in_tenant_timezone, get_current_request


def default_config_key():
    return str(uuid.uuid4())[:6]


def process_timestamp(datetime):
    try:
        request = get_current_request()
        return get_datetime_str_in_tenant_timezone(datetime, request.tenant)
    except Exception:
        return str(datetime)


class DefaultConfigKeyMixin:
    """
    Mixin class providing functionality to set a default config key if not provided.
    """

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = default_config_key()
        super().save(*args, **kwargs)


def validate_phone(phone_number):
    """
    Function to validate the phone number if it is from same region as app and if it is valid.
    """
    try:
        # phone_number = phonenumbers.format_number(
        #     phone_number, phonenumbers.PhoneNumberFormat.E164
        # )
        # print(phone_number)
        phone_number = phonenumbers.parse(
            phone_number, region=settings.PHONENUMBER_DEFAULT_REGION
        )
        if phonenumbers.is_valid_number(phone_number):
            return True
    except:
        return False
