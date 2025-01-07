from django.db.models import Q

from ....packages.crud.table.base import ModelTable
from ....packages.crud.table.column import ModelCol

from .models import ExportJob


class DownloadsTable(ModelTable):
    id = ModelCol(display_as="ID", sortable=True, searchable=True)
    created_at = ModelCol(display_as="Initiated At", sortable=True, searchable=True)
    status = ModelCol(display_as="Status", sortable=False, searchable=True)
    file = ModelCol(display_as="File", sortable=False, searchable=False)

    table_actions = []
    row_actions = []

    def get_table_data_queryset(self):
        return ExportJob.objects.filter(
            user=self.crud_view_instance.request.user
        ).order_by("-created_at")

    def id_getval(self, obj):
        return obj.id + 10000

    def id_Q_obj(self, search_term):
        try:
            id_val = int(search_term) - 10000
        except:
            id_val = None
        if id_val:
            return Q(id=id_val)
        return Q()

    class Meta:
        model = ExportJob
        fields = ["id", "created_at", "status", "file"]
        row_selector = {"enabled": False, "multi": False}
