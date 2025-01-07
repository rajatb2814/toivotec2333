from django.db.models import Q
from django.conf import settings
import phonenumbers
from bs4 import BeautifulSoup

from ....packages.crud.table.base import ModelTable
from ....packages.crud.table.column import ModelCol, StringCol
from ..email.models import EmailModel, EmailAttachment
from ..telephony.models import CallRecordModel
from ..sms.models import SMSTransactionsModel
from ..videocall.models import VideoCallRecordModel
from ..utils import process_timestamp
from .detail import EmailDetail, SMSDetail, CallDetail, VideoCallDetail


class EmailTable(ModelTable):
    id = ModelCol(display_as="ID", sortable=True, searchable=True)
    from_email = ModelCol(display_as="From", sortable=True, searchable=True)
    to_email = ModelCol(display_as="To", sortable=True, searchable=True)
    cc_email = ModelCol(display_as="Cc", sortable=True, searchable=True)
    subject = ModelCol(display_as="Subject", sortable=True, searchable=True)
    email_body = ModelCol(display_as="Body", sortable=True, searchable=True)
    status = ModelCol(display_as="Status", sortable=True, searchable=True)
    timestamp = ModelCol(display_as="Timestamp", sortable=True, searchable=True)
    attachments = StringCol(display_as="Attachments", sortable=False, searchable=False)

    table_actions = []
    row_actions = []

    class Meta:
        model = EmailModel
        fields = [
            "id",
            "from_email",
            "to_email",
            "cc_email",
            "subject",
            "email_body",
            "status",
            "timestamp",
            "attachments",
        ]
        detail_class = EmailDetail

    def id_getval(self, obj):
        return int(obj.id) + 10000

    def timestamp_getval(self, obj):
        return process_timestamp(obj.timestamp)

    def email_body_getval(self, obj):
        body = obj.email_body
        try:
            text = ""
            soup = BeautifulSoup(body, "html.parser")
            body = soup.find("body")
            for child in body.children:
                text += child.text
            return text.replace("\n", "").strip()
        except Exception:
            return obj.email_body

    def get_table_metadata(self):

        # This mapping is used to hide certain columns in the table
        # based on the email type
        field_mapping = {
            "received": ["to_email"],
            "sent": ["from_email"],
            "draft": ["from_email"],
        }
        email_type = self.request.GET.get("type", "")
        row_selector = getattr(self.Meta, "row_selector", {})
        row_selector_enabled = row_selector.get("enabled", False)
        card_primary_fields = getattr(self.Meta, "card_primary_fields", [])

        columns = [
            f[1].get_col_metadata(
                self.request, col_index + 1 if row_selector_enabled else col_index
            )
            for col_index, f in enumerate(self._fields)
            if f[0] not in field_mapping.get(email_type, [])
        ]
        metadata = {
            "pagination": self.pagination,
            "columns": columns,
            "row_selector": row_selector,
            "actions": self.actions_metadata,
            "card_primary_fields": card_primary_fields,
            # "actions": self.get_actions_metadata()
        }
        return metadata

    def attachments_getval(self, obj):
        try:
            attachment = EmailAttachment.objects.filter(email=obj).first()
            url = self.request.build_absolute_uri(attachment.file.url)
            svg = f"""
                    <a href='{url}' target='_blank' style='color: var(--primary-color);'>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.45455 27H22.5455C23.9006 26.999 24.999 25.9442 25 24.6429V12.0714C24.999 10.7701 23.9006 9.71527 22.5455 9.71429H20.0909V7.35714C20.0899 6.0558 18.9915 5.00098 17.6364 5H9.45455C8.09943 5.00098 7.00102 6.0558 7 7.35714V24.6429C7.00102 25.9442 8.09943 26.999 9.45455 27ZM8.63636 7.35714C8.63636 6.92303 9.00249 6.57143 9.45455 6.57143H17.6364C18.0884 6.57143 18.4545 6.92303 18.4545 7.35714V10.5C18.4545 10.7082 18.5405 10.9086 18.6939 11.0559C18.8473 11.2032 19.0559 11.2857 19.2727 11.2857H22.5454C22.9975 11.2857 23.3636 11.6373 23.3636 12.0714V24.6428C23.3636 25.077 22.9975 25.4286 22.5454 25.4286H9.45453C9.00248 25.4286 8.63635 25.077 8.63635 24.6428L8.63636 7.35714Z" fill="currentColor"/>
                        <path d="M11.0906 23.8576H15.9997C16.4518 23.8576 16.8179 23.506 16.8179 23.0718C16.8179 22.6377 16.4518 22.2861 15.9997 22.2861H11.0906C10.6386 22.2861 10.2724 22.6377 10.2724 23.0718C10.2724 23.506 10.6386 23.8576 11.0906 23.8576Z" fill="currentColor"/>
                        <path d="M11.0906 20.714H19.2724C19.7245 20.714 20.0906 20.3624 20.0906 19.9283C20.0906 19.4942 19.7245 19.1426 19.2724 19.1426H11.0906C10.6386 19.1426 10.2724 19.4942 10.2724 19.9283C10.2724 20.3624 10.6386 20.714 11.0906 20.714Z" fill="currentColor"/>
                        <path d="M13.5452 17.5718C15.3523 17.5718 16.8179 16.1644 16.8179 14.429C16.8179 12.6936 15.3523 11.2861 13.5452 11.2861V12.8576C14.2069 12.8576 14.8042 13.2406 15.0568 13.8279C15.3104 14.4152 15.1703 15.091 14.7019 15.5398C14.2345 15.9896 13.5308 16.1242 12.9193 15.8806C12.3077 15.638 11.9088 15.0645 11.9088 14.429H10.2724C10.2745 16.1645 11.738 17.5699 13.5452 17.5719L13.5452 17.5718Z" fill="currentColor"/>
                    </a>
                """
            return svg
        except Exception:
            return "NaN"

    def get_table_data_queryset(self):
        queryset = super().get_table_data_queryset()
        email_type = self.request.GET.get("type", "")
        if email_type == "sent":
            queryset = queryset.filter(email_type="OUT")
        if email_type == "received":
            queryset = queryset.filter(email_type="IN")
        if email_type == "draft":
            queryset = queryset.filter(email_type="DR")
        return queryset

    def id_Q_obj(self, search_term):
        try:
            modified_id = int(search_term) - 10000
        except ValueError:
            return Q()
        return Q(id=modified_id)

    def from_email_getval(self, obj):
        from_email = obj.from_email
        if "<" in from_email:
            from_email = from_email.split("<")[1].split(">")[0]
        return from_email


class TelephonyTable(ModelTable):
    id = ModelCol(display_as="ID", sortable=True, searchable=True)
    destination_number = ModelCol(display_as="To", sortable=True, searchable=True)
    agent = ModelCol(display_as="Agent", sortable=True, searchable=True)
    call_duration = ModelCol(
        display_as="Call Duration(sec)", sortable=True, searchable=True
    )
    start_time = ModelCol(display_as="Start Time", sortable=True, searchable=True)
    call_record = ModelCol(display_as="Call Record", sortable=True, searchable=True)
    call_status = ModelCol(display_as="Status", sortable=True, searchable=True)

    table_actions = []
    row_actions = []

    def get_table_metadata(self):
        call_type = self.request.GET.get("type", "")
        field_mapping = {
            "incoming": ["destination_number"],
            "outgoing": [""],
        }
        row_selector = getattr(self.Meta, "row_selector", {})
        row_selector_enabled = row_selector.get("enabled", False)
        card_primary_fields = getattr(self.Meta, "card_primary_fields", [])

        columns = [
            f[1].get_col_metadata(
                self.request, col_index + 1 if row_selector_enabled else col_index
            )
            for col_index, f in enumerate(self._fields)
            if f[0] not in field_mapping.get(call_type, [])
        ]
        metadata = {
            "pagination": self.pagination,
            "columns": columns,
            "row_selector": row_selector,
            "actions": self.actions_metadata,
            "card_primary_fields": card_primary_fields,
            "phone_number_extension": f"+{phonenumbers.country_code_for_region(settings.PHONENUMBER_DEFAULT_REGION)}",
            # "actions": self.get_actions_metadata()
        }
        return metadata

    def agent_getval(self, obj):
        return obj.agent.user.name

    def id_getval(self, obj):
        return int(obj.id) + 10000

    def call_record_getval(self, obj):
        try:
            url = self.request.build_absolute_uri(obj.call_record.url)
            svg = f"""
                    <a href='{url}' target='_blank' style='color: var(--primary-color);'>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.45455 27H22.5455C23.9006 26.999 24.999 25.9442 25 24.6429V12.0714C24.999 10.7701 23.9006 9.71527 22.5455 9.71429H20.0909V7.35714C20.0899 6.0558 18.9915 5.00098 17.6364 5H9.45455C8.09943 5.00098 7.00102 6.0558 7 7.35714V24.6429C7.00102 25.9442 8.09943 26.999 9.45455 27ZM8.63636 7.35714C8.63636 6.92303 9.00249 6.57143 9.45455 6.57143H17.6364C18.0884 6.57143 18.4545 6.92303 18.4545 7.35714V10.5C18.4545 10.7082 18.5405 10.9086 18.6939 11.0559C18.8473 11.2032 19.0559 11.2857 19.2727 11.2857H22.5454C22.9975 11.2857 23.3636 11.6373 23.3636 12.0714V24.6428C23.3636 25.077 22.9975 25.4286 22.5454 25.4286H9.45453C9.00248 25.4286 8.63635 25.077 8.63635 24.6428L8.63636 7.35714Z" fill="currentColor"/>
                        <path d="M11.0906 23.8576H15.9997C16.4518 23.8576 16.8179 23.506 16.8179 23.0718C16.8179 22.6377 16.4518 22.2861 15.9997 22.2861H11.0906C10.6386 22.2861 10.2724 22.6377 10.2724 23.0718C10.2724 23.506 10.6386 23.8576 11.0906 23.8576Z" fill="currentColor"/>
                        <path d="M11.0906 20.714H19.2724C19.7245 20.714 20.0906 20.3624 20.0906 19.9283C20.0906 19.4942 19.7245 19.1426 19.2724 19.1426H11.0906C10.6386 19.1426 10.2724 19.4942 10.2724 19.9283C10.2724 20.3624 10.6386 20.714 11.0906 20.714Z" fill="currentColor"/>
                        <path d="M13.5452 17.5718C15.3523 17.5718 16.8179 16.1644 16.8179 14.429C16.8179 12.6936 15.3523 11.2861 13.5452 11.2861V12.8576C14.2069 12.8576 14.8042 13.2406 15.0568 13.8279C15.3104 14.4152 15.1703 15.091 14.7019 15.5398C14.2345 15.9896 13.5308 16.1242 12.9193 15.8806C12.3077 15.638 11.9088 15.0645 11.9088 14.429H10.2724C10.2745 16.1645 11.738 17.5699 13.5452 17.5719L13.5452 17.5718Z" fill="currentColor"/>
                    </a>
                """
            return svg
        except Exception as e:
            return "NaN"

    class Meta:
        model = CallRecordModel
        fields = [
            "id",
            "destination_number",
            "agent",
            "call_duration",
            "start_time",
            "call_status",
            "call_record",
        ]
        detail_class = CallDetail

    def get_table_data_queryset(self):
        queryset = super().get_table_data_queryset()
        call_type = self.request.GET.get("type", "")
        if call_type == "incoming":
            queryset = queryset.filter(call_type="Inbound")
        if call_type == "outgoing":
            queryset = queryset.filter(call_type="Outbound")
        return queryset

    def id_Q_obj(self, search_term):
        try:
            modified_id = int(search_term) - 10000
        except ValueError:
            return Q()
        return Q(id=modified_id)


class SMSTable(ModelTable):
    id = ModelCol(display_as="ID", sortable=True, searchable=True)
    to_number = ModelCol(display_as="To", sortable=True, searchable=True)
    message = ModelCol(display_as="Message", sortable=True, searchable=True)
    status = ModelCol(display_as="Status", sortable=True, searchable=True)
    date_sent = ModelCol(display_as="Timestamp", sortable=True, searchable=True)
    src = ModelCol(display_as="Source", sortable=True, searchable=True)

    table_actions = []
    row_actions = []

    class Meta:
        model = SMSTransactionsModel
        fields = [
            "id",
            "to_number",
            "src",
            "message",
            "status",
            "date_sent",
        ]
        detail_class = SMSDetail

    def id_getval(self, obj):
        return int(obj.id) + 10000

    def date_sent_getval(self, obj):
        return process_timestamp(obj.date_sent)


class VideoCallTable(ModelTable):
    id = ModelCol(display_as="ID", sortable=True, searchable=True)
    room_id = ModelCol(display_as="Room ID", sortable=True, searchable=True)
    start_time = ModelCol(display_as="Start Time", sortable=True, searchable=True)
    end_time = ModelCol(display_as="End Time", sortable=True, searchable=True)
    meeting_host = ModelCol(display_as="Meeting Host", sortable=True, searchable=True)
    created_by = ModelCol(display_as="Created By", sortable=True, searchable=True)

    table_actions = []
    row_actions = []

    class Meta:
        model = VideoCallRecordModel
        fields = [
            "id",
            "room_id",
            "start_time",
            "end_time",
            "meeting_host",
            "created_by",
        ]
        detail_class = VideoCallDetail

    def id_getval(self, obj):
        return int(obj.id) + 10000

    def start_time_getval(self, obj):
        if obj.start_time is None:
            return "NA"
        return process_timestamp(obj.start_time)

    def end_time_getval(self, obj):
        if obj.end_time is None:
            return "NA"
        return process_timestamp(obj.end_time)

    def id_Q_obj(self, search_term):
        try:
            modified_id = int(search_term) - 10000
        except ValueError:
            return Q()
        return Q(id=modified_id)

    def meeting_host_getval(self, obj):

        return obj.meeting_host.host_name if obj and obj.meeting_host else "NA"
