import io
import uuid
import pytz
import email
import imaplib
import traceback

from datetime import datetime

from django.db import models
from django.core.files import File
from django_smtp_ssl import SSLEmailBackend  # for port 465
from django.core.mail.backends.smtp import EmailBackend
from django.core.mail import EmailMultiAlternatives
from django.contrib.postgres.fields import JSONField, ArrayField

from zango.apps.dynamic_models.models import DynamicModelBase
from zango.apps.dynamic_models.fields import ZForeignKey
from zango.core.storage_utils import ZFileField
from zango.apps.appauth.models import AppUserModel


from ..utils import DefaultConfigKeyMixin
from .oauth2_utils import oAuth2EmailBackend


class EmailConfigModel(DefaultConfigKeyMixin, DynamicModelBase):
    """
    Model representing the configuration for sending and receiving emails.

    Attributes:
        key (CharField): Unique identifier for the email configuration.
        from_email (EmailField): Default sender's email address for outgoing emails.
        provider (CharField): Provider type for email services (e.g., 'basic' for simple SMTP, IMAP).
        provider_package_name (CharField): Name of the package associated with the email provider.
        config (JSONField): Configuration settings in JSON format for the email provider.
        is_default (BooleanField): Indicates if this email configuration is the default.
        is_active (BooleanField): Indicates if this email configuration is currently active.
    """

    key = models.CharField(max_length=100, unique=True, blank=True)
    from_email = models.EmailField(max_length=254)
    provider = models.CharField(
        max_length=100, default="basic"
    )  # basic stands for simple SMTP, IMAP
    provider_package_name = models.CharField(max_length=100, blank=True)
    config = JSONField(verbose_name="Config", null=True)
    is_default = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Email Settings for {self.key}"

    def get_smtp_connection(self):
        """
        Retrieves a connection based on the configured provider.

        Returns:
            object: A connection object.
        """
        if self.provider == "basic":
            _kwargs = {
                "host": self.config["smtp_host"],
                "port": self.config["smtp_port"],
                "username": self.config["smtp_username"],
                "password": self.config["smtp_password"],
                "use_ssl": True if self.config["smtp_encryption"] == "SSL" else False,
                "use_tls": True if self.config["smtp_encryption"] == "TLS" else False,
            }
            if self.config["smtp_port"] == 465:
                connection = SSLEmailBackend(**_kwargs)
            else:
                connection = EmailBackend(**_kwargs)
        elif "smtp_oauth2" in self.provider:
            connection = oAuth2EmailBackend(config_obj=self)
        return connection

    def sync_mailbox_basic(self, folder_type="INBOX"):
        """
        Syncs emails from the specified folder in the IMAP server.

        Args:
            folder_type (str, optional): The type of folder to sync from, defaults to "INBOX".

        Returns:
            None
        """
        imap_server = self.config["imap_host"]
        imap_username = self.config["imap_username"]
        imap_password = self.config["imap_password"]
        imap_connection = imaplib.IMAP4_SSL(imap_server)
        imap_connection.login(imap_username, imap_password)
        imap_connection.select(folder_type)
        _, email_numbers = imap_connection.search(None, "ALL")
        email_numbers = email_numbers[0].split()
        email_numbers.reverse()
        for num in email_numbers:
            try:
                status, data = imap_connection.fetch(num, "(RFC822)")
                if status == "OK":
                    initial_msg = email.message_from_bytes(data[0][1])
                    message_id = initial_msg.get("Message-ID")
                    if EmailModel.objects.filter(message_id=message_id).exists():
                        break

                    subject = (
                        initial_msg.get("Subject") if initial_msg.get("Subject") else ""
                    )
                    from_email = initial_msg.get("From")
                    to_email = str(initial_msg.get("To")).split(",")
                    date_tuple = email.utils.parsedate_tz(initial_msg.get("Date"))
                    email_received_date = datetime.fromtimestamp(
                        email.utils.mktime_tz(date_tuple), pytz.timezone("UTC")
                    )

                    cc = (
                        str(initial_msg.get("Cc")).split(",")
                        if initial_msg.get("Cc")
                        else []
                    )
                    bcc = (
                        str(initial_msg.get("Bcc")).split(",")
                        if initial_msg.get("Bcc")
                        else []
                    )

                    zmail_obj = EmailModel.objects.create(
                        message_id=message_id,
                        subject=subject,
                        from_email=from_email,
                        to_email=to_email,
                        timestamp=email_received_date,
                        cc_email=cc,
                        bcc_email=bcc,
                        mail_config=self,
                        email_type="IN",
                        status="received",
                    )
                    for response in data:
                        if isinstance(response, tuple):
                            msg = email.message_from_bytes(response[1])

                            if msg.is_multipart():
                                for part in msg.walk():
                                    content_type = part.get_content_type()
                                    content_disposition = str(
                                        part.get("Content-Disposition")
                                    )
                                    body = ""
                                    try:
                                        body = (
                                            part.get_payload(decode=True)
                                            if part.get_payload(decode=True)
                                            else ""
                                        )
                                    except Exception as e:
                                        pass

                                    if "attachment" not in content_disposition:
                                        if content_type in ["text/html"]:
                                            EmailAlternative.objects.create(
                                                email=zmail_obj,
                                                alternative_body=body,
                                                alternative_type=content_type,
                                            )
                                            zmail_obj.email_body = body
                                            zmail_obj.save()

                                    else:
                                        filename = part.get_filename()
                                        if filename:
                                            fa_model = EmailAttachment.objects.create(
                                                email=zmail_obj,
                                                name=filename[:100],
                                                size=28,
                                            )
                                            file_byte_data = io.BytesIO(
                                                part.get_payload(decode=True)
                                            )
                                            fa_model.file.save(
                                                filename,
                                                File(file_byte_data),
                                                save=True,
                                            )

                            else:
                                content_type = msg.get_content_type()
                                body = msg.get_payload(decode=True)
                                EmailAlternative.objects.create(
                                    zemail=zmail_obj,
                                    alternative_body=body,
                                    alternative_type=content_type,
                                )
                                zmail_obj.email_body = body
                                zmail_obj.save()
            except Exception as e:
                print(str(e))
                pass
        # logger.exception(
        #     "EXCEPTION: IMAP SYNCING for email_number {num} of username {uname}: {e}".format(
        #         num=num, uname=email_username, e=str(e)
        #     ))

        imap_connection.close()
        imap_connection.logout()

    def sync_mailbox(self, folder_type="INBOX"):
        """
        Method for syncing mailbox
        """
        if self.provider == "basic":
            self.sync_mailbox_basic()
        else:  # To be implemented for other server types
            pass


class EmailModel(DynamicModelBase):
    """
    Model representing an email message.

    Attributes:
        uuid (UUIDField): Unique identifier for the email message.
        mail_config (ForeignKey): Reference to the EmailConfigModel associated with this email.
        message_id (CharField): Identifier from the email provider's server.
        from_email (EmailField): Sender's email address.
        to_email (ArrayField): List of recipient email addresses.
        cc_email (ArrayField): List of CC recipient email addresses.
        bcc_email (ArrayField): List of BCC recipient email addresses.
        subject (CharField): Subject of the email.
        email_body (TextField): Body content of the email.
        email_type (CharField): Type of the email (Inbound, Outbound, Draft).
        timestamp (DateTimeField): Date and time when the email was created.
        status (CharField): Status of the email (Staged, Sent, Failed, Service Inactive).
        send_responses (JSONField): Responses received after sending the email.
        send_attempt_number (IntegerField): Number of attempts made to send the email.
        owner (ForeignKey): Reference to the AppUserModel, representing the owner of draft emails.
    """

    EMAIL_TYPES = [
        ("IN", "Inbound"),
        ("OUT", "Outbound"),
        ("DR", "Draft"),
    ]
    STATUS = [
        ("staged", "Staged"),
        ("sent", "Sent"),
        ("failed", "Failed"),
        ("service_inactive", "Service Inactive"),
        ("received", "Received"),
    ]
    uuid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    mail_config = ZForeignKey(EmailConfigModel, on_delete=models.CASCADE)
    message_id = models.CharField(
        "Message ID", max_length=255, blank=True
    )  # stores provider server's id of email
    from_email = models.EmailField(max_length=254)
    to_email = ArrayField(models.EmailField(max_length=254), blank=True, default=list)
    cc_email = ArrayField(
        models.EmailField(max_length=254), blank=True, default=list, null=True
    )
    bcc_email = ArrayField(
        models.EmailField(max_length=254), blank=True, default=list, null=True
    )
    subject = models.CharField(max_length=255, blank=True)
    email_body = models.TextField(blank=True)
    email_type = models.CharField(max_length=3, choices=EMAIL_TYPES, default="DR")
    timestamp = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS, default="staged")
    send_responses = JSONField(null=True, blank=True)
    send_attempt_number = models.IntegerField(default=0)

    owner = ZForeignKey(
        AppUserModel, null=True, on_delete=models.CASCADE
    )  # for assigning ownership of drafts

    def __str__(self):
        status = self.status
        return f"{status} Email from {self.from_email} to {self.to_email}"

    def send_email(self):
        connection = self.mail_config.get_smtp_connection()
        mail_dict = {
            "subject": self.subject,
            "body": self.email_body,
            "from_email": self.from_email,
            "to": self.to_email,
            "cc": self.cc_email,
            "bcc": self.bcc_email,
            "connection": connection,
            "headers": {"Message-ID": self.message_id},
        }
        if not self.from_email:
            mail_dict["from_email"] = self.from_email
        email = EmailMultiAlternatives(**mail_dict)
        for a in self.alternatives.all():
            email.attach_alternative(a.alternative_body, a.alternative_type)
        for a in self.attachments.all():
            email.attach(a.name, a.file.read(), a.content_type)
        try:
            send_ = email.send(fail_silently=False)
            self.status = "sent"
            self.timestamp = datetime.now()
        except Exception as e:
            traceback.print_exc()
            responses = self.send_responses if self.send_responses else []
            self.send_responses = responses.append(e)
            self.status = "failed"
        self.save()
        return


class EmailAttachment(DynamicModelBase):
    """
    Model representing an attachment associated with an email.

    Attributes:
        email (ForeignKey): Reference to the EmailModel to which this attachment belongs.
        file (FileField): Field storing the attachment file.
        name (CharField): Original name of the attached file.
        content_type (CharField): MIME type of the attached file.
        size (PositiveIntegerField): Size of the attached file in bytes.
    """

    email = ZForeignKey(
        EmailModel, related_name="attachments", on_delete=models.CASCADE
    )
    file = ZFileField(upload_to="email_attachments/")
    name = models.CharField(max_length=255)  # Original file name
    content_type = models.CharField(max_length=100)  # MIME type
    size = models.PositiveIntegerField()  # File size in bytes

    def __str__(self):
        return f"Attachment for {self.email}: {self.name} ({self.size} bytes)"


class EmailAlternative(DynamicModelBase):
    """
    Model representing an alternative content for an email.

    Attributes:
        email (ForeignKey): Reference to the EmailModel to which this alternative belongs.
        alternative_body (TextField): Body content of the alternative.
        alternative_type (CharField): Type of the alternative content.
    """

    email = ZForeignKey(
        EmailModel, related_name="alternatives", on_delete=models.CASCADE
    )
    alternative_body = models.TextField("Alternative Body", blank=True)
    alternative_type = models.CharField("Alternative Type", max_length=255, blank=True)

    def __str__(self):
        return f"Alternative for {self.email}: {self.alternative_type}"
