import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../../core/services/patient.service';
import { Gender, Patient } from '../../../core/models';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-form.component.html',
})
export class PatientFormComponent implements OnInit {
  @Input() patient: Patient | null = null;
  @Output() close = new EventEmitter<boolean>();

  saving = false;
  error = '';
  model: {
    full_name: string; email: string; phone: string; date_of_birth: string;
    gender: Gender; address: string; blood_group: string; emergency_contact: string;
  } = { full_name: '', email: '', phone: '', date_of_birth: '', gender: 'male', address: '', blood_group: '', emergency_contact: '' };

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    if (this.patient) {
      this.model = {
        full_name: this.patient.full_name, email: this.patient.email, phone: this.patient.phone,
        date_of_birth: this.patient.date_of_birth || '', gender: this.patient.gender,
        address: this.patient.address, blood_group: this.patient.blood_group,
        emergency_contact: this.patient.emergency_contact,
      };
    }
  }

  get isEdit(): boolean { return !!this.patient; }

  save(): void {
    this.saving = true;
    this.error = '';
    const request = this.isEdit
      ? this.patientService.update(this.patient!.id, this.model)
      : this.patientService.create(this.model);
    request.subscribe({
      next: () => { this.saving = false; this.close.emit(true); },
      error: () => { this.saving = false; this.error = 'Could not save patient. Please check the fields.'; },
    });
  }

  cancel(): void { this.close.emit(false); }
}
