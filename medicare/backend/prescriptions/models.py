from django.db import models

from doctors.models import Doctor
from patients.models import Patient


class Prescription(models.Model):
    """prescriptions table"""

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="prescriptions")
    doctor = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True, related_name="prescriptions")
    diagnosis = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Prescription #{self.id} for {self.patient}"


class PrescriptionItem(models.Model):
    """prescription_items table"""

    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE, related_name="items")
    medicine_name = models.CharField(max_length=150)
    dosage = models.CharField(max_length=50, blank=True)
    frequency = models.CharField(max_length=50, blank=True)
    duration = models.CharField(max_length=50, blank=True)
    instructions = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.medicine_name
