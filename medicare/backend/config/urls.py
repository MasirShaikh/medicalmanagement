from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/doctors/", include("doctors.urls")),
    path("api/patients/", include("patients.urls")),
    path("api/appointments/", include("appointments.urls")),
    path("api/medical-records/", include("medical_records.urls")),
    path("api/prescriptions/", include("prescriptions.urls")),
    path("api/billing/", include("billing.urls")),
    path("api/reports/", include("reports.urls")),
]
