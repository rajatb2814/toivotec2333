from celery import shared_task

from .utils import clean_row_value


def get_table_data(request, table_obj):
    objects = table_obj.get_data(request)
    serializer = table_obj.get_serializer()
    data = serializer(objects, many=True).data
    result = []
    i = 0
    for d in data:
        result.append({"obj": objects[i], "serialized": d})
        i += 1
    data = table_obj.post_process_data(result)

    return data


@shared_task
def export_table(request_data, export_job_id):
    import io
    import xlsxwriter

    from django.http import HttpRequest
    from django.db import connection

    from zango.apps.dynamic_models.workspace.base import Workspace
    from zango.apps.appauth.models import AppUserModel, UserRoleModel

    from ....packages.frame.downloads.models import ExportJob

    request = HttpRequest()
    request.path = request_data["path"]
    request.tenant = connection.tenant
    request.method = "GET"
    request.GET = request_data["params"]
    request.user = (
        AppUserModel.objects.get(id=request_data.get("user_id"))
        if request_data.get("user_id")
        else None
    )

    ws = Workspace(request.tenant, as_systemuser=True)
    ws.ready()
    view, resolve = ws.match_view(request)

    if not view:
        return

    view_class = view.view_class

    view_instancte = view_class()
    view_instancte.request = request

    # table_class = view_class.table
    table_obj = view_instancte.get_table_obj()
    table_obj.user_role = UserRoleModel.objects.get(id=request_data.get("user_role_id"))

    data = get_table_data(request, table_obj)
    table_metadata = table_obj.get_table_metadata()

    col_dict = {}
    for col in table_metadata["columns"]:
        col_dict[col["name"]] = col.get("display_name", col["name"])

    output = io.BytesIO()
    workbook = xlsxwriter.Workbook(output)
    worksheet = workbook.add_worksheet()
    header = col_dict.values()
    for col_num, value in enumerate(header):
        worksheet.write(0, col_num, value)

    row = 1
    for d in data:
        for column_num, col in enumerate(col_dict.keys()):
            val = d[col]
            row_val = clean_row_value(val)
            worksheet.write(row, column_num, row_val)
            column_num += 1
        row += 1

    workbook.close()
    output.seek(0)

    export_job_obj = ExportJob.objects.get(id=export_job_id)
    export_job_obj.file.save("export.xlsx", output)
    export_job_obj.status = "completed"
    export_job_obj.save()
