from rest_framework import viewsets

from .models import Department, Doctor
from .serializers import DepartmentSerializer, DoctorSerializer


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.select_related("department").all()
    serializer_class = DoctorSerializer
    filterset_fields = ["status", "department", "specialization"]
    search_fields = ["name", "specialization"]
