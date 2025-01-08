
from django.urls import path, include, re_path


from .views import PatientCrudView, PatientProfileView, TivotecIOTFeed



urlpatterns = [
    
    path('patients/', PatientCrudView.as_view(), name='PatientCrudView'),
    re_path(r'^patients/profile/(?P<slug>[-\w]+)/$', PatientProfileView.as_view()),
    path('patients/toivotek_iot_feed/', TivotecIOTFeed.as_view(), name='TivotecIOTFeed'),
    
]