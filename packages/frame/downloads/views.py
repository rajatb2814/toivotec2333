from ....packages.crud.base import BaseCrudView

from .tables import DownloadsTable


class DownloadCrudView(BaseCrudView):
    page_title = "My Downloads"
    add_btn_title = ""
    table = DownloadsTable
    form = None

    def display_add_button_check(self, request):
        return False
