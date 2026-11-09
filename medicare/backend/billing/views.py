from rest_framework import viewsets

from .models import Invoice, Payment
from .serializers import InvoiceSerializer, PaymentSerializer


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.select_related("patient").prefetch_related("items").all()
    serializer_class = InvoiceSerializer
    filterset_fields = ["status", "patient"]


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.select_related("invoice").all()
    serializer_class = PaymentSerializer
    filterset_fields = ["invoice"]
