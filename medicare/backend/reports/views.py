from datetime import timedelta

from django.db.models import Count, Q, Sum
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView

from appointments.models import Appointment
from billing.models import Invoice
from doctors.models import Doctor
from patients.models import Patient


class DashboardStatisticsView(APIView):
    """
    GET /api/reports/dashboard-statistics/?range=today|7d|30d

    Returns dashboard statistics based on the APPOINTMENT DATE.
    """

    def get(self, request):

        range_key = request.query_params.get("range", "today")

        today = timezone.localdate()

        # -----------------------------
        # Date range
        # -----------------------------

        if range_key == "7d":
            start_date = today - timedelta(days=6)
        elif range_key == "30d":
            start_date = today - timedelta(days=29)
        else:
            range_key = "today"
            start_date = today

        # -----------------------------
        # Basic cards
        # -----------------------------

        total_patients = Patient.objects.count()

        available_doctors = Doctor.objects.filter(
            status=Doctor.AVAILABLE
        ).count()

        # -----------------------------
        # Appointments
        # -----------------------------

        appts_in_range = Appointment.objects.filter(
            date__gte=start_date,
            date__lte=today
        )

        total_appts = appts_in_range.count()

        scheduled = appts_in_range.filter(
            status=Appointment.SCHEDULED
        ).count()

        completed = appts_in_range.filter(
            status=Appointment.COMPLETED
        ).count()

        cancelled = appts_in_range.filter(
            status=Appointment.CANCELLED
        ).count()

        no_show = appts_in_range.filter(
            status=Appointment.NO_SHOW
        ).count()

        # -----------------------------
        # Revenue
        # -----------------------------

        revenue = Invoice.objects.filter(
            created_at__gte=start_date,
            status=Invoice.PAID
        ).aggregate(
            total=Sum("total")
        )["total"] or 0

        # -----------------------------
        # Pending payments
        # -----------------------------

        pending_payments = Invoice.objects.filter(
            status__in=[
                Invoice.PENDING,
                Invoice.PARTIAL
            ]
        ).aggregate(
            total=Sum("total")
        )["total"] or 0

        # -----------------------------
        # Doctor performance
        # -----------------------------

        doctor_performance = list(
            Doctor.objects.annotate(
                appt_count=Count("appointments"),

                completed_count=Count(
                    "appointments",
                    filter=Q(
                        appointments__status=Appointment.COMPLETED
                    )
                ),

            ).values(
                "id",
                "name",
                "appt_count",
                "completed_count"
            )[:10]
        )

        # -----------------------------
        # Response
        # -----------------------------

        return Response({

            "range": range_key,

            "cards": {
                "total_patients": total_patients,
                "appointments": total_appts,
                "available_doctors": available_doctors,
                "pending_payments": float(pending_payments),
            },

            "appointment_status": {
                "scheduled": scheduled,
                "completed": completed,
                "cancelled": cancelled,
                "no_show": no_show,
            },

            "revenue": float(revenue),

            "doctor_performance": doctor_performance,
        })