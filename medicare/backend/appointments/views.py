from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Appointment
from .serializers import AppointmentSerializer

# Fixed daily slot list — matches the clinic's consultation timings.
DAILY_SLOTS = [
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
]


class AppointmentViewSet(viewsets.ModelViewSet):
    """
    Maps to: GET/POST /api/appointments/, GET/PUT/PATCH/DELETE /api/appointments/{id}/
    Plus GET /api/appointments/available-slots/?doctor=<id>&date=YYYY-MM-DD
    """

    queryset = Appointment.objects.select_related("patient", "doctor").all()
    serializer_class = AppointmentSerializer
    filterset_fields = ["status", "doctor", "patient", "date"]
    search_fields = ["patient__full_name", "doctor__name"]
    ordering_fields = ["date", "created_at"]

    @action(detail=False, methods=["get"], url_path="available-slots")
    def available_slots(self, request):
        doctor_id = request.query_params.get("doctor")
        date = request.query_params.get("date")
        if not doctor_id or not date:
            return Response({"detail": "doctor and date query params are required."}, status=400)

        booked = set(
            Appointment.objects.filter(doctor_id=doctor_id, date=date)
            .exclude(status=Appointment.CANCELLED)
            .values_list("time", flat=True)
        )
        slots = [{"time": t, "available": t not in booked} for t in DAILY_SLOTS]
        return Response({"doctor": int(doctor_id), "date": date, "slots": slots})
