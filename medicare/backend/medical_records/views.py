from rest_framework import viewsets

from .models import MedicalRecord
from .serializers import MedicalRecordSerializer


class MedicalRecordViewSet(viewsets.ModelViewSet):
    queryset = MedicalRecord.objects.select_related("patient", "doctor").all()
    serializer_class = MedicalRecordSerializer
    filterset_fields = ["patient", "doctor"]
