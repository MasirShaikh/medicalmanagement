from django.contrib import admin

from .models import Patient


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ["id", "full_name", "phone", "gender", "blood_group"]
    search_fields = ["full_name", "phone", "email"]
