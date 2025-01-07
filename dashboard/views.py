from django.views.generic import View, TemplateView
from ..packages.crud.mixin import CrudRequestMixin
from ..packages.frame.decorator import add_frame_context



class DashboardPatientData(TemplateView, CrudRequestMixin):

    template_name = "dashboard_data.html"

    @add_frame_context
    def get_context_data(self, **kwargs):
        context = {}
        context["display_sidebar"] = True
        context["page_title"] = "Dashboard Data"

        return context