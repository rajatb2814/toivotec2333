
from django.urls import path, include


from .views import ClinicCrudView



urlpatterns = [
    
    path('clinics/', ClinicCrudView.as_view(), name='ClinicCrudView'),
    
]