import base64
import smtplib
import imaplib
import requests

from django.db import connection
from django.core.mail.backends.smtp import EmailBackend
from django.http import HttpRequest

from zango.core.utils import get_current_request, get_package_url


class oAuth2EmailBackend(EmailBackend):
    """
    A wrapper that manages the oAuth2.0 SMTP network connection.
    """

    def __init__(self, config_obj):
        # Initialize the oAuth2EmailBackend with the provided configuration object
        self.config_obj = config_obj
        config = config_obj.config
        super(oAuth2EmailBackend, self).__init__(**config)
        self.provider = config.get("provider")
        self.access_token = config.get("access_token")
        self.refresh_token = config.get("refresh_token")
        self.username = config.get("from_email")

    def regenerate_tokens(self):
        # Regenerate access tokens based on the specified provider
        if self.provider == "smtp_oauth2_microsoft":
            response = requests.get(
                get_package_url(
                    get_current_request(),
                    f"oauth2_smtp/oauth/?action=regenerate_tokens&pk={self.config_obj.pk}",
                    self.config_obj.provider_package_name,
                )
            )
            response_data = response.json()
            return response_data.get("success", False), response_data["response"].get(
                "access_token", ""
            )
        else:
            return False, "Invalid Config!"

    def open(self):
        # Open an oAuth2.0 SMTP connection
        if self.connection:
            return False
        try:
            success, access_token = self.regenerate_tokens()
            if success:
                smtp_conn = smtplib.SMTP(self.host, self.port)
                smtp_conn.set_debuglevel(True)
                smtp_conn.ehlo()
                smtp_conn.starttls()
                smtp_conn.ehlo()
                auth_string = "user=%s\1auth=Bearer %s\1\1" % (
                    self.username,
                    access_token,
                )
                auth_string = base64.b64encode(auth_string.encode("ascii")).decode(
                    "ascii"
                )
                smtp_conn.docmd("AUTH", f"XOAUTH2 {auth_string}")
                self.connection = smtp_conn
                return True
            else:
                return False

        except Exception as e:
            # Handle exceptions and raise if not in fail_silently mode
            if not self.fail_silently:
                raise e
