import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../../core/services/patient.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Doctor, Patient, SlotInfo } from '../../../core/models';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-appointment.component.html',
})
export class BookAppointmentComponent implements OnInit {
  @Output() close = new EventEmitter<boolean>();

  patients: Patient[] = [];
  doctors: Doctor[] = [];
  slots: SlotInfo[] = [];

  selectedPatient: number | null = null;
  selectedDoctor: number | null = null;
  selectedDate = new Date().toISOString().slice(0, 10);
  selectedSlot: string | null = null;

  loadingSlots = false;
  saving = false;
  error = '';

  constructor(
    private patientService: PatientService,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.patientService.list().subscribe((res) => (this.patients = res.results));
    this.doctorService.list().subscribe((res) => {
      this.doctors = res.results.filter((d) => d.status === 'available');
      if (this.doctors.length) {
        this.selectedDoctor = this.doctors[0].id;
        this.loadSlots();
      }
    });
  }

  onDoctorChange(): void { this.loadSlots(); }
  onDateChange(): void { this.loadSlots(); }

  loadSlots(): void {
    if (!this.selectedDoctor || !this.selectedDate) return;
    this.selectedSlot = null;
    this.loadingSlots = true;
    // This calls the real backend endpoint, which checks the appointments table
    // for this doctor+date and returns which of the fixed slots are already taken —
    // this is the actual double-booking prevention, not a frontend guess.
    this.appointmentService.availableSlots(this.selectedDoctor, this.selectedDate).subscribe({
      next: (res) => { this.slots = res.slots; this.loadingSlots = false; },
      error: () => { this.loadingSlots = false; },
    });
  }

  pickSlot(slot: SlotInfo): void {
    if (!slot.available) return;
    this.selectedSlot = slot.time;
  }

  confirmBooking(): void {
    if (!this.selectedPatient || !this.selectedDoctor || !this.selectedSlot) {
      this.error = 'Please select patient, doctor, date and a time slot.';
      return;
    }
    this.saving = true;
    this.error = '';
    this.appointmentService.create({
      patient: this.selectedPatient,
      doctor: this.selectedDoctor,
      date: this.selectedDate,
      time: this.selectedSlot,
    }).subscribe({
      next: () => { this.saving = false; this.close.emit(true); },
      error: (err) => {
        this.saving = false;
        // If someone else booked this exact slot a second before us, the backend's
        // unique constraint / serializer validation rejects it — we surface that here
        // and refresh the slot list so the UI reflects reality.
        this.error = err?.error?.non_field_errors?.[0] || 'This slot was just booked. Please pick another.';
        this.loadSlots();
      },
    });
  }

  cancel(): void { this.close.emit(false); }
}
