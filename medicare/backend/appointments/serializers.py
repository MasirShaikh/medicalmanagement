from rest_framework import serializers

from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source="patient.full_name", read_only=True)
    doctor_name = serializers.CharField(source="doctor.name", read_only=True)

    class Meta:
        model = Appointment
        fields = [
            "id", "patient", "patient_name", "doctor", "doctor_name",
            "date", "time", "status", "notes", "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate(self, attrs):
        """
        Business rule: the same doctor cannot have two active appointments
        at the same date + time. This mirrors the frontend's slot picker,
        but is enforced here so it holds even if two people book at once.
        """
        doctor = attrs.get("doctor", getattr(self.instance, "doctor", None))
        date = attrs.get("date", getattr(self.instance, "date", None))
        time = attrs.get("time", getattr(self.instance, "time", None))
        status = attrs.get("status", getattr(self.instance, "status", Appointment.SCHEDULED))

        if status != Appointment.CANCELLED:
            clash = Appointment.objects.filter(
                doctor=doctor, date=date, time=time
            ).exclude(status=Appointment.CANCELLED)
            if self.instance:
                clash = clash.exclude(pk=self.instance.pk)
            if clash.exists():
                raise serializers.ValidationError(
                    "This doctor already has an appointment at the selected date and time."
                )
        return attrs
