"""Defines which API URLs."""
from django.urls import re_path

from .views import AppUserLoginView, AppOpenIDLogin


urlpatterns = [
    re_path(r"^/$", AppUserLoginView.as_view()),
    re_path(r"^sso/$", AppOpenIDLogin.as_view(), name='openid_login'),
]
