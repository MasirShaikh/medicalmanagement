import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment } from '../../../core/models';
import { BookAppointmentComponent } from '../book-appointment/book-appointment.component';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, FormsModule, BookAppointmentComponent],
  templateUrl: './appointment-list.component.html',
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = true;
  statusFilter = '';
  count = 0;
  showBooking = false;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void { this.fetch(); }

  fetch(): void {
    this.loading = true;
    this.appointmentService.list({ status: this.statusFilter }).subscribe({
      next: (res) => { this.appointments = res.results; this.count = res.count; this.loading = false; },
      error: () => (this.loading = false),
    });
  }

  markCompleted(a: Appointment): void {
    this.appointmentService.update(a.id, { status: 'completed' }).subscribe(() => this.fetch());
  }

  cancel(a: Appointment): void {
    if (!confirm('Cancel this appointment?')) return;
    this.appointmentService.update(a.id, { status: 'cancelled' }).subscribe(() => this.fetch());
  }

  closeBooking(booked: boolean): void {
    this.showBooking = false;
    if (booked) this.fetch();
  }
}
