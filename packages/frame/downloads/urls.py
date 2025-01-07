from django.urls import path

from .views import DownloadCrudView

urlpatterns = [path("downloads/", DownloadCrudView.as_view())]
