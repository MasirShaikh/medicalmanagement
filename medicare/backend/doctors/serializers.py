from rest_framework import serializers

from .models import Department, Doctor


class DepartmentSerializer(serializers.ModelSerializer):
    doctor_count = serializers.IntegerField(source="doctors.count", read_only=True)

    class Meta:
        model = Department
        fields = ["id", "name", "description", "doctor_count"]


class DoctorSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.name", read_only=True, default="")

    class Meta:
        model = Doctor
        fields = [
            "id", "name", "specialization", "department", "department_name",
            "email", "phone", "experience_years", "qualification", "consultation_fee",
            "available_days", "available_time", "status", "created_at",
        ]
        read_only_fields = ["id", "created_at"]
