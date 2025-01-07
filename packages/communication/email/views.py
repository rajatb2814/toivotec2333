import json
import os
import mimetypes

from rest_framework.views import APIView
from rest_framework.views import APIView
from django.core.files.base import ContentFile
from django.core.files import File
from django.forms.models import model_to_dict

from zango.core.api import get_api_response

from .utils import Email, get_email_body
from .models import (
    EmailConfigModel,
    EmailModel,
    EmailAttachment,
    EmailAlternative,
)
from .serializers import EmailConfigureSerializer, EmailModelSerializer


def create_email(request):
    files = dict(request.FILES)
    try:
        request_body = request.data
    except AttributeError:
        request_body = request.POST
    html_body = {
        "context": {"email_content": request_body["body"]},
        "request": request,
        "template": "communication/email/email_template.html",
    }
    email = Email(
        to=request_body["to"].split(","),
        cc=request_body.get("cc", "").split(","),
        bcc=request_body.get("bcc", "").split(","),
        subject=request_body.get("subject"),
        html_body=html_body,
    )
    for attachment in files.get("attachments", []):
        email.attach(attachment)
    return email


class EmailAPIView(APIView):
    def post(self, request, *args, **kwargs):
        action = request.GET.get("action", "")
        if action == "send":
            draft = request.GET.get("draft", None)
            pk = request.GET.get("pk", None)
            if draft:
                email = EmailModel.objects.get(pk=pk)
                EmailAlternative.objects.get(email=email).delete()
                EmailAttachment.objects.filter(email=email).delete()
                email.delete()
            email = create_email(request)
            success, email_msg = email.send_email()
            if email_msg.status == "service_inactive":
                return get_api_response(True, "Email service inactive", 200)
            if success:
                #     email_msg.status = "sent"
                #     email_msg.save()
                return get_api_response(True, "Email sent successfully", 200)
            else:
                #     email_msg.status = "failed"
                #     email_msg.save()
                return get_api_response(False, "Email failed", 400)
        if action == "draft":
            body = request.data
            files = dict(request.FILES)
            file_names = []
            if files.get("attachments", []) != []:
                for attachment in files["attachments"]:
                    file_names.append(attachment.name)
            email = create_email(request)
            success, resp = email.send_email(draft=True)
            if success:
                return get_api_response(True, "Email draft successfully", 200)
            else:
                return get_api_response(False, resp, 400)
        return get_api_response(False, "Invalid action", 400)

    def put(self, request, *args, **kwargs):
        body = dict(request.data)
        action = request.GET.get("action", None)
        pk = request.GET.get("pk", None)
        if action == "update_draft":
            files = dict(request.FILES)
            html_body = {
                "context": {"email_content": body["body"]},
                "request": request,
                "template": "email/email_template.html",
            }
            _, html_content = get_email_body(html_body)
            email_obj = EmailModel.objects.get(pk=pk)
            email_obj.to_email = body["to"]
            email_obj.cc_email = body.get("cc", [])
            email_obj.bcc_email = body.get("bcc", [])
            email_obj.subject = body["subject"][0]
            email_obj.email_body = html_content
            email_obj.save()
            existing_attachments = [
                attachment.pk
                for attachment in EmailAttachment.objects.filter(email=email_obj)
            ]
            sent_attachments = body.get("attachments", [])
            for attachment in existing_attachments:
                if str(attachment) not in sent_attachments:
                    EmailAttachment.objects.get(pk=attachment).delete()
            for attachment in files.get("attachments", []):
                ea = EmailAttachment.objects.create(
                    email=email_obj,
                    name=attachment.name,
                    content_type=attachment.content_type,
                    size=attachment.size,
                )
                ea.file.save(attachment.name, ContentFile(attachment.file.read()))
                ea.save()
            existing_alternative = EmailAlternative.objects.get(email=email_obj)
            existing_alternative.alternative_body = html_body
            existing_alternative.save()
            return get_api_response(True, "Email updated successfully", 200)
        return get_api_response(False, "Invalid action", 400)


class EmailConfigureView(APIView):
    """
    SMS APIs for configurig SMS's
    Typically utilized by the provider packages.
    """

    def get(self, request, *args, **kwargs):
        action = request.GET.get("action", "")
        if action == "fetch_configs":
            provider = request.GET.get("provider", "")
            objects = EmailConfigModel.objects.filter(provider=provider).order_by(
                "-modified_at"
            )
            result = EmailConfigureSerializer(objects, many=True).data
            return get_api_response(True, result, 200)
        elif action == "initialize_form":
            path = os.path.dirname(os.path.realpath(__file__))
            with open(f"{path}/basic_provider_schema.json", "r") as f:
                schema = json.load(f)
                return get_api_response(True, {"form": schema}, 200)
        elif action == "get_edit_form_schema":
            path = os.path.dirname(os.path.realpath(__file__))
            pk = request.GET.get("pk", None)
            email_config = EmailConfigModel.objects.get(pk=pk)
            with open(f"{path}/basic_provider_schema.json", "r") as f:
                schema = json.load(f)
                schema["form_data"] = email_config.config
            return get_api_response(True, {"form": schema}, 200)
        elif action == "get_config":
            pk = request.GET.get("pk", None)
            key = request.GET.get("key", None)
            if pk is not None:
                email_config = EmailConfigModel.objects.get(pk=pk)
            elif key is not None:
                email_config = EmailConfigModel.objects.get(key=key)
            else:
                try:
                    email_config = EmailConfigModel.objects.get(is_default=True)
                except EmailConfigModel.DoesNotExist:
                    return get_api_response(False, "No default config found", 200)
            email_config = model_to_dict(email_config)
            return get_api_response(True, email_config, 200)
        elif action == "get_update_schema":
            path = os.path.dirname(os.path.realpath(__file__))
            pk = request.GET.get("pk", None)
            email_config = EmailConfigModel.objects.get(pk=pk)
            with open(f"{path}/basic_provider_schema.json", "r") as f:
                schema = json.load(f)
                schema["form_data"] = email_config.config
            return get_api_response(True, {"form": schema}, 200)
        return get_api_response(True, "config fetched", 200)

    def post(self, request, *args, **kwargs):
        body = request.data
        action = request.GET.get("action", "")
        provider = request.GET.get("provider", None)
        provider_package_name = request.GET.get("provider_package_name", None)
        if action == "create_config":
            try:
                EmailConfigModel.objects.create(
                    config=body,
                    provider=provider if provider else "basic",
                    provider_package_name=provider_package_name
                    if provider_package_name
                    else "communication/email",
                )
            except Exception as e:
                if provider == "basic":
                    return get_api_response(
                        False,
                        {"errors": {"__all__": {"__errors": [str(e)]}}},
                        500,
                    )
                return get_api_response(False, str(e), 500)
        return get_api_response(True, "config created", 200)

    def put(self, request, *args, **kwargs):
        body = request.data
        action = request.GET.get("action", None)
        pk = request.GET.get("pk", None)
        if action == "update_config":
            email_config = EmailConfigModel.objects.get(pk=pk)
            email_config.config = body
            email_config.save()
        return get_api_response(True, "config updated", 200)


class EmailORMView(APIView):
    def get(self, request, *args, **kwargs):
        action = request.GET.get("action", None)
        if action == "fetch_email_alternative":
            email_id = request.GET.get("email_id", None)
            email_alternative = EmailAlternative.objects.get(email_id=email_id)
            return get_api_response(True, model_to_dict(email_alternative), 200)
        return get_api_response(False, "Invalid action", 400)

    def post(self, request, *args, **kwargs):
        body = request.data
        action = request.GET.get("action", None)
        if action == "create_email":
            config_key = request.GET.get("config_key", None)
            if config_key is not None:
                email_config = EmailConfigModel.objects.get(key=config_key)
            else:
                email_config = EmailConfigModel.objects.get(is_default=True)
            email_obj = EmailModel.objects.create(mail_config=email_config, **body)
            return get_api_response(True, model_to_dict(email_obj), 200)
        elif action == "create_email_alternative":
            email_alternative = EmailAlternative.objects.create(**body)
            return get_api_response(True, model_to_dict(email_alternative), 200)
        elif action == "create_email_attachment":
            email_attachment = EmailAttachment(
                email_id=body["email_id"],
                name=body["file_name"],
                content_type=mimetypes.guess_type(body["file_path"])[0],
                size=os.path.getsize(body["file_path"]),
            )
            email_attachment.file.save(
                body["file_name"], ContentFile(open(body["file_path"], "rb").read())
            )
            email_attachment.save()
            os.remove(body["file_path"])
            return get_api_response(True, "Email attachment created", 200)
        elif action == "email_query":
            emails = EmailModel.objects.filter(**body)
            return get_api_response(
                True, EmailModelSerializer(emails, many=True).data, 200
            )
        return get_api_response(False, "Invalid action", 400)

    def put(self, request, *args, **kwargs):
        body = request.data
        action = request.GET.get("action", None)
        pk = request.GET.get("pk", None)
        if action == "update_email_alternative":
            try:
                email_alternative = EmailAlternative.objects.get(pk=pk)
                email_alternative.__dict__.update(**body)
                email_alternative.save()
            except EmailAlternative.DoesNotExist:
                return get_api_response(False, "Email alternative not found", 404)
            return get_api_response(True, model_to_dict(email_alternative), 200)
        return get_api_response(False, "Invalid action", 400)
