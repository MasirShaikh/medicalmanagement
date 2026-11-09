import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../../core/services/patient.service';
import { Patient } from '../../../core/models';
import { PatientFormComponent } from '../patient-form/patient-form.component';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PatientFormComponent],
  templateUrl: './patient-list.component.html',
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  loading = true;
  search = '';
  count = 0;
  showForm = false;
  editingPatient: Patient | null = null;

  constructor(private patientService: PatientService) {}

  ngOnInit(): void { this.fetch(); }

  fetch(): void {
    this.loading = true;
    this.patientService.list({ search: this.search }).subscribe({
      next: (res) => { this.patients = res.results; this.count = res.count; this.loading = false; },
      error: () => (this.loading = false),
    });
  }

  openCreate(): void { this.editingPatient = null; this.showForm = true; }
  openEdit(p: Patient): void { this.editingPatient = p; this.showForm = true; }
  closeForm(saved: boolean): void { this.showForm = false; this.editingPatient = null; if (saved) this.fetch(); }

  remove(p: Patient): void {
    if (!confirm(`Delete patient "${p.full_name}"?`)) return;
    this.patientService.delete(p.id).subscribe(() => this.fetch());
  }
}
