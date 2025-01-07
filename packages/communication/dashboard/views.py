from zango.core.api import get_api_response

from ....packages.crud.base import BaseCrudView
from ..sms.utils import SMS
from .tables import EmailTable, TelephonyTable, SMSTable, VideoCallTable
from .forms import EmailForm, SMSForm
from ..email.views import create_email
from ..utils import validate_phone


class EmailCrudView(BaseCrudView):
    table_template = "communication/dashboard/email.html"
    detail_template = "communication/dashboard/email_detailview.html"

    page_title = "Emails"
    add_btn_title = "Compose Email"
    table = EmailTable
    form = EmailForm

    def has_add_perm(self, request):
        return False

    def display_add_button_check(self, request):
        return False

    def post(self, request, *args, **kwargs):
        form_type = request.GET.get("form_type")
        if form_type == "create_form":
            email = create_email(request)
            success, resp = email.send_email()
            if success:
                return get_api_response(True, "Email sent successfully", 200)
            else:
                return get_api_response(False, resp, 400)


class SMSCrudView(BaseCrudView):
    page_title = "SMS"
    add_btn_title = "New SMS"
    table = SMSTable
    form = SMSForm

    def has_add_perm(self, request):
        return True

    def display_add_button_check(self, request):
        return True

    def post(self, request, *args, **kwargs):
        form_type = request.GET.get("form_type")
        if form_type == "create_form":
            body = request.POST
            sms = SMS(
                body["body"],
                body["to"],
                body.get("key", None),
                request=request,
            )
            if not validate_phone(body["to"]):
                return get_api_response(
                    False,
                    {"errors": {"__all__": {"__errors": ["Invalid phone number"]}}},
                    200,
                )
            try:
                sms.send_sms()
                return get_api_response(True, "SMS sent", 200)
            except Exception as e:
                return get_api_response(False, str(e), 400)


class VideoCallCrudView(BaseCrudView):
    page_title = "Video Call"
    add_btn_title = ""
    table = VideoCallTable

    def has_add_perm(self, request):
        return False

    def display_add_button_check(self, request):
        return False


class TelephonyCrudView(BaseCrudView):
    table_template = "communication/dashboard/telephony.html"

    page_title = "Telephony"
    add_btn_title = "Call"
    table = TelephonyTable

    def has_add_perm(self, request):
        return False

    def display_add_button_check(self, request):
        return False
