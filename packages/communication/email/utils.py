import uuid
from datetime import datetime
import html
import mimetypes
from email.utils import make_msgid

from django.core.files.base import ContentFile
from django.template import loader
from django.utils.html import strip_tags

from .models import (
    EmailConfigModel,
    EmailModel,
    EmailAttachment,
    EmailAlternative,
)
from ..configure.models import CommmunicationActiveModel


def get_email_body(html_body={}):
    """
    Function to generate body for email
    html_body must be a dict with mandatory keys as template, context  and optional
    key as request
    """
    context = html_body.get("context")
    request = html_body.get("request", None)
    if request:
        if not context.get("site"):
            if request.is_secure():
                site = "https://" + request.META["HTTP_HOST"]
            else:
                site = "http://" + request.META["HTTP_HOST"]
            context["site"] = site
        context["secure"] = request.is_secure()
        context["host"] = request.META.get("HTTP_HOST")
    html_content = loader.render_to_string(html_body.get("template"), context)
    html_content = html.unescape(html_content)
    body = strip_tags(html_content)
    return body, html_content


class Email:
    def __init__(self, to, cc=[], bcc=[], subject="", text_body="", html_body={}):
        self.to = to
        self.cc = cc
        self.bcc = bcc
        self.subject = subject
        self.text_body = text_body
        self.html_body = html_body
        self.attachments = []
        self.alternatives = []

    def attach(self, file):
        file_name = file.name
        file_read_stream = file.file
        file_type = mimetypes.guess_type(file.name)[0]
        size = file.size
        self.attachments.append((file_name, file_read_stream, file_type, size))

    def get_config(self, key):
        if not key:
            try:
                return EmailConfigModel.objects.get(is_default=True)
            except EmailConfigModel.DoesNotExist:
                return None
        else:
            try:
                return EmailConfigModel.objects.get(key=key)
            except EmailConfigModel.DoesNotExist:
                return None

    def _stage_email(self, key, draft):
        html_content = None
        if self.html_body:
            body, html_content = get_email_body(self.html_body)
        email_msg = EmailModel.objects.create(
            mail_config=self.config,
            from_email=self.config.config["from_email"],
            to_email=self.to,
            cc_email=self.cc,
            bcc_email=self.bcc,
            subject=self.subject,
            email_type="DR" if draft else "OUT",
            status="staged",
            email_body=html_content if html_content else self.text_body,
            timestamp=datetime.now(),
            message_id="",
        )
        email_msg.message_id = make_msgid(f"zango-out-{self.config.key}-{email_msg.pk}")
        email_msg.save()
        if self.html_body:
            if not EmailAlternative.objects.filter(email=email_msg).exists():
                EmailAlternative.objects.create(
                    email=email_msg,
                    alternative_body=html_content,
                    alternative_type="text/html",
                )
        for a in self.attachments:
            fname = a[0]
            # file = f"{settings.BASE_DIR}/temp/{fname}"
            fa = EmailAttachment.objects.create(
                email=email_msg,
                name=a[0],
                content_type=a[2],
                size=a[3],
            )
            a[1].seek(0)
            fa.file.save(fname, ContentFile(a[1].read()))
        email_msg.save()
        return email_msg

    def send_email(self, key=None, draft=False, user_obj=None):
        communication_active = CommmunicationActiveModel.objects.first()
        self.config = self.get_config(key)
        if not self.config:
            return False, "Configuration not available. Please check!"
        else:
            email_msg = self._stage_email(key, draft)
            if not draft:
                if not communication_active.email:
                    email_msg.status = "service_inactive"
                    email_msg.save()
                    return (True, email_msg)
                # if self.config.provider == "basic":
                resp = email_msg.send_email()
                # else:
                # make an API call to the provider package to send email
            return (True, email_msg)
