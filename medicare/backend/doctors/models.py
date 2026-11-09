from django.conf import settings
from django.db import models


class Department(models.Model):
    """departments table"""

    name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.name


class Doctor(models.Model):
    """doctors table"""

    AVAILABLE = "available"
    ON_LEAVE = "on_leave"
    STATUS_CHOICES = [(AVAILABLE, "Available"), (ON_LEAVE, "On Leave")]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="doctor_profile",
        null=True, blank=True,
    )
    name = models.CharField(max_length=150)
    specialization = models.CharField(max_length=100)
    department = models.ForeignKey(
        Department, on_delete=models.SET_NULL, null=True, blank=True, related_name="doctors"
    )
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    experience_years = models.PositiveIntegerField(default=0)
    qualification = models.CharField(max_length=150, blank=True)
    consultation_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    available_days = models.CharField(max_length=50, default="Mon-Sat")
    available_time = models.CharField(max_length=50, default="10:00 AM - 5:00 PM")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=AVAILABLE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
