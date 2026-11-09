from django.db import models

from doctors.models import Doctor
from patients.models import Patient


class Appointment(models.Model):
    """appointments table"""

    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"

    STATUS_CHOICES = [
        (SCHEDULED, "Scheduled"),
        (COMPLETED, "Completed"),
        (CANCELLED, "Cancelled"),
        (NO_SHOW, "No Show"),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="appointments")
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="appointments")
    date = models.DateField()
    time = models.CharField(max_length=20)  # e.g. "10:00 AM"
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=SCHEDULED)
    notes = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "-id"]
        # Prevents the same doctor from being double-booked at the same date+time
        # at the database level (in addition to the API-level check in the serializer).
        constraints = [
            models.UniqueConstraint(
                fields=["doctor", "date", "time"],
                condition=~models.Q(status="cancelled"),
                name="unique_doctor_slot_unless_cancelled",
            )
        ]

    def __str__(self):
        return f"{self.patient} with {self.doctor} on {self.date} {self.time}"
