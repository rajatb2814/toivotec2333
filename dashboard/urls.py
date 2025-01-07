
from django.urls import path, include, re_path
from .views import DashboardPatientData



urlpatterns = [
    
    path('patient_data/', DashboardPatientData.as_view(), name='DashboardPatientData'),
    
]