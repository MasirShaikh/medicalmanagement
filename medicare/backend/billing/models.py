from django.db import models

from appointments.models import Appointment
from patients.models import Patient


class Invoice(models.Model):
    """invoices table"""

    PAID = "paid"
    PENDING = "pending"
    PARTIAL = "partial"
    CANCELLED = "cancelled"
    STATUS_CHOICES = [
        (PAID, "Paid"), (PENDING, "Pending"), (PARTIAL, "Partial"), (CANCELLED, "Cancelled"),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="invoices")
    appointment = models.ForeignKey(
        Appointment, on_delete=models.SET_NULL, null=True, blank=True, related_name="invoices"
    )
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Invoice #{self.id} - {self.patient}"


class InvoiceItem(models.Model):
    """invoice_items table"""

    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="items")
    description = models.CharField(max_length=150)  # e.g. "Consultation", "Medicine", "Test"
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.description} - {self.amount}"


class Payment(models.Model):
    """payments table"""

    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=30, default="cash")
    paid_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.amount} for Invoice #{self.invoice_id}"
