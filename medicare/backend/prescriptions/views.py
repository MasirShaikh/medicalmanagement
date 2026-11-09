from rest_framework import viewsets

from .models import Prescription
from .serializers import PrescriptionSerializer


class PrescriptionViewSet(viewsets.ModelViewSet):
    """
    Maps to: POST /api/prescriptions/, GET /api/prescriptions/?patient={id}
    """

    queryset = Prescription.objects.select_related("patient", "doctor").prefetch_related("items").all()
    serializer_class = PrescriptionSerializer
    filterset_fields = ["patient", "doctor"]
