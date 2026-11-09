import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DoctorService } from '../../../core/services/doctor.service';
import { Doctor } from '../../../core/models';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-list.component.html',
})
export class DoctorListComponent implements OnInit {

  doctors: Doctor[] = [];

  loading = true;
  saving = false;
  showDoctorForm = false;

  // null = Add mode, number = Edit mode (doctor ka id)
  editingId: number | null = null;

  doctor: Partial<Doctor> = this.emptyDoctor();

  constructor(
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    this.fetch();
  }

  private emptyDoctor(): Partial<Doctor> {
    return {
      name: '',
      specialization: '',
      department: null,
      email: '',
      phone: '',
      experience_years: 0,
      qualification: '',
      consultation_fee: 0,
      available_days: '',
      available_time: '',
      status: 'available'
    };
  }

  fetch(): void {
    this.loading = true;

    this.doctorService.list().subscribe({
      next: (res) => {
        this.doctors = res.results;
        this.loading = false;
      },

      error: (err) => {
        console.error('Error loading doctors:', err);
        this.loading = false;
      }
    });
  }

  // ---------- ADD ----------
  openDoctorForm(): void {
    this.editingId = null;
    this.doctor = this.emptyDoctor();
    this.showDoctorForm = true;
  }

  // ---------- EDIT ----------
  openEditForm(d: Doctor): void {
    this.editingId = d.id;

    // copy bana rahe hain taaki table ka data save se pehle change na ho
    this.doctor = {
      ...d,
      consultation_fee: Number(d.consultation_fee) || 0,
      experience_years: Number(d.experience_years) || 0,
    };

    this.showDoctorForm = true;
  }

  closeDoctorForm(): void {
    if (!this.saving) {
      this.showDoctorForm = false;
      this.editingId = null;
    }
  }

  // ---------- SAVE (add + edit dono) ----------
  saveDoctor(): void {

    if (
      !this.doctor.name ||
      !this.doctor.specialization ||
      !this.doctor.phone
    ) {
      alert('Please fill Doctor Name, Specialization and Phone.');
      return;
    }

    this.saving = true;

    const payload: Partial<Doctor> = {
      name: this.doctor.name,
      specialization: this.doctor.specialization,
      department: null,
      email: this.doctor.email || '',
      phone: this.doctor.phone,
      experience_years: Number(this.doctor.experience_years) || 0,
      qualification: this.doctor.qualification || '',
      consultation_fee: Number(this.doctor.consultation_fee) || 0,
      available_days: this.doctor.available_days || '',
      available_time: this.doctor.available_time || '',
      status: this.doctor.status || 'available'
    };

    const request$ = this.editingId !== null
      ? this.doctorService.update(this.editingId, payload)
      : this.doctorService.create(payload);

    request$.subscribe({

      next: () => {
        this.saving = false;
        this.showDoctorForm = false;
        this.editingId = null;
        this.fetch();
      },

      error: (err) => {
        console.error('DOCTOR SAVE ERROR:', err);
        console.error('STATUS:', err.status);
        console.error('ERROR BODY:', err.error);

        this.saving = false;

        const backendError =
          typeof err.error === 'string'
            ? err.error
            : JSON.stringify(err.error, null, 2);

        alert(`Doctor API Error\n\nStatus: ${err.status}\n\n${backendError}`);
      }
    });
  }
}