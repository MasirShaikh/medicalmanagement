from rest_framework import serializers

from .models import MedicalRecord


class MedicalRecordSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source="patient.full_name", read_only=True)
    doctor_name = serializers.CharField(source="doctor.name", read_only=True, default="")

    class Meta:
        model = MedicalRecord
        fields = [
            "id", "patient", "patient_name", "doctor", "doctor_name", "appointment",
            "symptoms", "diagnosis", "notes", "blood_pressure", "weight_kg",
            "temperature_c", "created_at",
        ]
        read_only_fields = ["id", "created_at"]
