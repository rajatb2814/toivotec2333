from django.urls import path
from .views import EmailAPIView, EmailConfigureView, EmailORMView

urlpatterns = [
    path("api/", EmailAPIView.as_view(), name="ZelthyEmailTest"),
    path("configure/api/", EmailConfigureView.as_view(), name="ZelthyEmailConfigure"),
    path("orm/api/", EmailORMView.as_view(), name="ZelthyEmailORM"),
]