from django.contrib import admin

from .models import Department, Doctor


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ["id", "name"]


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "specialization", "department", "status", "consultation_fee"]
    list_filter = ["status", "department"]
    search_fields = ["name", "specialization"]
