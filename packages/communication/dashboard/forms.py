import phonenumbers

from django.conf import settings
from django import forms

from ....packages.crud.forms import BaseForm, BaseSimpleForm
from ....packages.crud.form_fields import CustomSchemaField, ModelField
from ..email.models import EmailModel, EmailAttachment


class EmailForm(BaseForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance:
            self.initial["attachments"] = (
                EmailAttachment.objects.filter(email=self.instance).first().file
            )

    to_email = ModelField(placeholder="Enter recipients", required=False)
    cc_email = ModelField(placeholder="Enter recipients", required=False)
    subject = ModelField(placeholder="Enter Subject", required=False)
    email_body = ModelField(
        placeholder="Enter your Message",
        extra_schema={"type": "string", "title": "Body"},
        extra_ui_schema={
            "ui:placeholder": "Enter your Message",
            "ui:syncEnabled": False,
            "ui:autocomplete": {},
            "ui:errorMessages": {
                "required": "Message is required",
            },
            "ui:widget": "RichTextEditorWidget",
            "ui:modules": {
                "toolbar": [
                    [{"header": [1, 2, False]}],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [
                        {"list": "ordered"},
                        {"list": "bullet"},
                        {"indent": "-1"},
                        {"indent": "+1"},
                    ],
                    ["link", "image"],
                    ["clean"],
                ],
            },
            "ui:formats": [
                "header",
                "bold",
                "italic",
                "underline",
                "strike",
                "blockquote",
                "list",
                "bullet",
                "indent",
                "link",
                "image",
            ],
        },
    )
    attachments = forms.FileField()

    class Meta:
        model = EmailModel
        title = "Edit Draft Email"
        order = ["to_email", "cc_email", "subject", "email_body", "attachments"]


class SMSForm(BaseSimpleForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.custom_schema_fields["to"].schema["countryCode"] = (
            f"+{phonenumbers.country_code_for_region(settings.PHONENUMBER_DEFAULT_REGION)}"
        )

    to = CustomSchemaField(
        schema={"type": "string", "title": "To"},
        ui_schema={
            "ui:placeholder": "Enter recipients",
            "ui:syncEnabled": False,
            "ui:autocomplete": {},
            "ui:errorMessages": {
                "required": "To is required",
            },
            "ui:widget": "MobileFieldWidget",
        },
    )
    body = CustomSchemaField(
        schema={"type": "string", "title": "Body"},
        ui_schema={
            "ui:placeholder": "Enter your Message",
            "ui:syncEnabled": False,
            "ui:autocomplete": {},
            "ui:errorMessages": {
                "required": "Message is required",
            },
            "ui:widget": "TextareaFieldWidget",
        },
    )

    class Meta:
        title = "Compose SMS"
        order = ["to", "body"]
