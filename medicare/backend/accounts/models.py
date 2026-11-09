from django.contrib.auth.models import AbstractUser
from django.db import models


class Role(models.Model):
    ADMIN = "admin"
    DOCTOR = "doctor"
    RECEPTIONIST = "receptionist"
    PATIENT = "patient"

    NAME_CHOICES = [
        (ADMIN, "Admin"),
        (DOCTOR, "Doctor"),
        (RECEPTIONIST, "Receptionist"),
        (PATIENT, "Patient"),
    ]

    name = models.CharField(max_length=20, choices=NAME_CHOICES, unique=True)

    def __str__(self):
        return self.name


class User(AbstractUser):
    role = models.ForeignKey(
        Role, on_delete=models.SET_NULL, null=True, blank=True, related_name="users"
    )
    phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return self.username
