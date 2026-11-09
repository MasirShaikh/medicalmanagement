from django.db import models

from appointments.models import Appointment
from doctors.models import Doctor
from patients.models import Patient


class MedicalRecord(models.Model):
    """medical_records table"""

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="medical_records")
    doctor = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True, related_name="medical_records")
    appointment = models.ForeignKey(
        Appointment, on_delete=models.SET_NULL, null=True, blank=True, related_name="medical_records"
    )
    symptoms = models.TextField(blank=True)
    diagnosis = models.CharField(max_length=255)
    notes = models.TextField(blank=True)
    blood_pressure = models.CharField(max_length=20, blank=True)
    weight_kg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    temperature_c = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.patient} - {self.diagnosis}"
