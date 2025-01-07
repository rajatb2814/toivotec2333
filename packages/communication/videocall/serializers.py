from rest_framework.serializers import ModelSerializer, SerializerMethodField

from .models import MeetingHostModel, VideoCallRecordModel


class MeetingHostSerializer(ModelSerializer):
    class Meta:
        model = MeetingHostModel
        fields = ["pk", "host_object_uuid", "provider_config", "host_name"]


class VideocallRecordSerializer(ModelSerializer):
    id = SerializerMethodField()
    room_id = SerializerMethodField()
    created_by = SerializerMethodField()
    meeting_host = SerializerMethodField()
    participants = SerializerMethodField()
    end_time = SerializerMethodField()
    start_time = SerializerMethodField()
    call_recording_url = SerializerMethodField()

    class Meta:
        model = VideoCallRecordModel
        fields = [
            "id",
            "room_id",
            "start_time",
            "end_time",
            "status",
            "meeting_host",
            "participants",
            "call_recording_url",
            "created_by",
        ]

    def get_id(self, obj):
        return obj.id + 10000

    def get_room_id(self, obj):
        return obj.meeting_details.get("topic") if obj.meeting_details else ""

    def get_meeting_host(self, obj):
        return str(obj.meeting_host.host_name)

    def get_created_by(self, obj):
        return obj.created_by.name

    def get_participants(self, obj):
        participants_str = ""
        if obj.participants:
            for particant in obj.participants:
                participants_str += (
                    "&nbsp;" + particant.get("name") + "&nbsp;"
                    if particant.get("name")
                    else "-"
                )
        return participants_str

    def get_end_time(self, obj):
        # CALL DURATION
        try:
            if obj.end_time and obj.start_time:
                time_difference = obj.end_time - obj.start_time

                # Extract hours, minutes, and seconds from the time difference
                hours, remainder = divmod(time_difference.seconds, 3600)
                minutes, seconds = divmod(remainder, 60)

                # Format the call duration
                return "{:02}:{:02}:{:02}".format(hours, minutes, seconds)

        except Exception as e:
            print(e)

        return "-"

    def get_start_time(self, obj):
        return obj.start_time.strftime("%d %b %Y %H:%M %p") if obj.start_time else "-"

    def get_call_recording_url(self, obj):
        return (
            f'<a href="{obj.call_recording_url}">link</a>'
            if obj.call_recording_url
            else ""
        )
