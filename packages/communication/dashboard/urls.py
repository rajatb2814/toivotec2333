from django.urls import path

from .views import EmailCrudView, SMSCrudView, TelephonyCrudView, VideoCallCrudView

urlpatterns = [
    path("email/", EmailCrudView.as_view()),
    path("sms/", SMSCrudView.as_view()),
    path("telephony/", TelephonyCrudView.as_view()),
    path("videocall/", VideoCallCrudView.as_view()),
]
