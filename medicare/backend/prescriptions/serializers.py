from rest_framework import serializers

from .models import Prescription, PrescriptionItem


class PrescriptionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescriptionItem
        fields = ["id", "medicine_name", "dosage", "frequency", "duration", "instructions"]


class PrescriptionSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source="patient.full_name", read_only=True)
    doctor_name = serializers.CharField(source="doctor.name", read_only=True, default="")
    items = PrescriptionItemSerializer(many=True)

    class Meta:
        model = Prescription
        fields = [
            "id", "patient", "patient_name", "doctor", "doctor_name",
            "diagnosis", "notes", "items", "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        items_data = validated_data.pop("items", [])
        prescription = Prescription.objects.create(**validated_data)
        for item in items_data:
            PrescriptionItem.objects.create(prescription=prescription, **item)
        return prescription

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if items_data is not None:
            instance.items.all().delete()
            for item in items_data:
                PrescriptionItem.objects.create(prescription=instance, **item)
        return instance
