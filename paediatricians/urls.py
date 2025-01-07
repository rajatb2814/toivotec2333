
from django.urls import path, include


from .views import PaediatricianCrudView



urlpatterns = [
    
    path('paediatricians/', PaediatricianCrudView.as_view(), name='PaediatricianCrudView'),
    
]