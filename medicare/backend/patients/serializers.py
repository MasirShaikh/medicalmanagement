from datetime import date

from rest_framework import serializers

from .models import Patient


class PatientSerializer(serializers.ModelSerializer):
    age = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = [
            "id", "full_name", "email", "phone", "date_of_birth", "age", "gender",
            "address", "blood_group", "emergency_contact", "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def get_age(self, obj):
        if not obj.date_of_birth:
            return None
        today = date.today()
        return today.year - obj.date_of_birth.year - (
            (today.month, today.day) < (obj.date_of_birth.month, obj.date_of_birth.day)
        )
