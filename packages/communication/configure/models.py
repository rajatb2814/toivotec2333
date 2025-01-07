from zango.apps.dynamic_models.models import DynamicModelBase
from django.db import models


class CommmunicationActiveModel(DynamicModelBase):
    """
    Model representing the activation status of communication services.

    Attributes:
        sms (bool): Indicates if SMS communication service is activated.
        email (bool): Indicates if email communication service is activated.
    """

    sms = models.BooleanField(default=False)
    email = models.BooleanField(default=False)
    imessage = models.BooleanField(default=False)
