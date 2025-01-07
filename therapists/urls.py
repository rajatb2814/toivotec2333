
from django.urls import path, include


from .views import TherapistCrudView



urlpatterns = [
    
    path('therapists/', TherapistCrudView.as_view(), name='TherapistCrudView'),
    
]