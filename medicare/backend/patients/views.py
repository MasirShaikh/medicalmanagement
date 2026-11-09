from rest_framework import viewsets

from .models import Patient
from .serializers import PatientSerializer


class PatientViewSet(viewsets.ModelViewSet):
    """
    Maps to: GET/POST /api/patients/, GET/PUT/PATCH/DELETE /api/patients/{id}/
    """

    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    filterset_fields = ["gender", "blood_group"]
    search_fields = ["full_name", "email", "phone"]
    ordering_fields = ["created_at", "full_name"]
