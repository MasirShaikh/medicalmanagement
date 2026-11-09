from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import Role, User


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ["id", "name"]


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ["id", "username", "email", "role", "is_active"]
    fieldsets = BaseUserAdmin.fieldsets + (("Extra", {"fields": ("role", "phone")}),)
