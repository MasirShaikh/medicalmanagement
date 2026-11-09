import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { PrescriptionService } from '../../core/services/prescription.service';
import { Prescription, Patient, Doctor } from '../../core/models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-prescription-list',
  standalone: true,
  imports: [CommonModule, FormsModule],

  template: `

  <!-- Prescription list: purane <style>...</style> ki jagah -->
<!-- prescription-list.component.ts ke template ke andar wala <style> block isse replace karo -->
<style>
:host{--green:#16A34A;--green-d:#0F9D6B;--mint:#34C58F;--ink:#0F1B4C;--text:#26335A;--muted:#6B7A99;--card:#FFFFFF;--card-2:#F1FAF5;--line:#E3EEE8;--field:#F2F5FF;--field-line:#D5DDF3;--danger:#DC2626;display:block;color:var(--text);font-family:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif}

/* ===== titles ===== */
h5{margin:0;font-family:'Plus Jakarta Sans','Inter',sans-serif;font-size:28px;font-weight:800;letter-spacing:-.8px;color:var(--ink)}
h6{margin:0 0 14px;font-family:'Plus Jakarta Sans','Inter',sans-serif;font-size:17px;font-weight:800;color:var(--ink)}
.text-muted{color:var(--muted)!important}
h5 .text-muted{font-weight:600}
.fw-medium{font-weight:700;color:var(--ink)}

/* ===== cards ===== */
.app-card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:18px;box-shadow:0 8px 26px -18px rgba(15,157,107,.35);color:var(--text)}
.app-card:has(> .table){padding:6px 12px 10px;overflow-x:auto}

/* ===== table ===== */
.table{width:100%;margin:0;border-collapse:collapse;--bs-table-bg:transparent;--bs-table-color:var(--text);--bs-table-border-color:var(--line);--bs-table-hover-bg:transparent;background:transparent;color:var(--text)}
.table > :not(caption) > * > *{background:transparent;color:var(--text);box-shadow:none;border-color:var(--line)}
.table thead th{padding:16px 14px 12px;text-align:left;font-size:12px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:var(--muted);border-bottom:1px solid var(--line)}
.table tbody td{padding:15px 14px;font-size:14px;border-bottom:1px solid var(--line);vertical-align:middle}
.table tbody tr:last-child td{border-bottom:0}
.table tbody tr:hover > td{background:var(--card-2)}
.table tbody tr:hover > td:first-child{border-radius:12px 0 0 12px}
.table tbody tr:hover > td:last-child{border-radius:0 12px 12px 0}
@media (max-width:900px){.table{min-width:680px}}

/* ===== buttons ===== */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:42px;padding:0 16px;border-radius:11px;border:1.5px solid transparent;font:inherit;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;transition:transform .2s,background .2s,border-color .2s,box-shadow .2s}
.btn-sm{height:36px;padding:0 14px;font-size:13px;border-radius:10px}
.d-flex.mb-3 > .btn{height:42px;padding:0 18px;font-size:14px;border-radius:11px}
.btn-primary,.btn-success{color:#fff;border:0;background:linear-gradient(135deg,#10A56F,#0B8F5F);box-shadow:0 6px 16px rgba(15,157,107,.28)}
.btn-primary:hover,.btn-success:hover{transform:translateY(-1px);box-shadow:0 10px 22px rgba(15,157,107,.36)}
.btn-outline-primary{color:var(--green-d);background:#fff;border-color:rgba(15,157,107,.35)}
.btn-outline-primary:hover{background:#E6F6EE;border-color:var(--green-d)}
.btn-outline-danger{color:var(--danger);background:#fff;border-color:rgba(220,38,38,.3)}
.btn-outline-danger:hover{background:rgba(220,38,38,.07);border-color:var(--danger)}
.btn-outline-secondary,.btn-outline-light{color:var(--ink);background:#fff;border-color:var(--line)}
.btn-outline-secondary:hover,.btn-outline-light:hover{background:var(--card-2);border-color:#CFE3D8}
.btn:disabled{opacity:.55;cursor:not-allowed;transform:none}
.btn:focus-visible{outline:3px solid rgba(15,157,107,.35);outline-offset:2px}

/* ===== form fields ===== */
.form-label{display:block;margin-bottom:7px;font-size:13px;font-weight:600;color:var(--ink)}
.form-control,.form-select{width:100%;height:46px;padding:9px 14px;border:1.5px solid var(--field-line);border-radius:12px;outline:none;font:inherit;font-size:14px;color:var(--ink);background-color:var(--field);box-sizing:border-box;transition:border-color .2s,box-shadow .2s,background-color .2s}
.form-select{appearance:none;padding-right:36px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' fill='none' stroke='%236B7A99' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center}
.form-control::placeholder{color:#8591AE}
.form-select option{background:#fff;color:var(--ink)}
.form-control:focus,.form-select:focus{border-color:var(--green-d);box-shadow:0 0 0 4px rgba(15,157,107,.13);background-color:#fff;color:var(--ink)}

/* ===== popup (appointments / patients modal) ===== */
.modal-backdrop-custom{position:fixed;inset:0;z-index:1000;background:rgba(15,27,76,.38);backdrop-filter:blur(4px)}
.modal-panel{position:fixed;inset:0;z-index:1001;display:flex;align-items:center;justify-content:center;padding:20px;pointer-events:none}
.modal-panel > .app-card{pointer-events:auto;max-width:100%;max-height:90vh;overflow-y:auto;padding:26px;border-radius:20px;box-shadow:0 30px 80px rgba(15,27,76,.25)}
.modal-panel h6{font-size:20px;margin-bottom:18px}
.alert{padding:10px 14px;border-radius:10px;font-size:13px}
.alert-danger{color:var(--danger);background:rgba(220,38,38,.07);border:1px solid rgba(220,38,38,.25)}
.small{font-size:13px}
.me-1{margin-right:6px}
.text-end{text-align:right}
.prescription-overlay{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(15,27,76,.38);backdrop-filter:blur(4px)}

/* ===== popup ===== */
.prescription-popup{max-width:760px;padding:26px;width:100%;max-height:90vh;overflow-y:auto;color:var(--text);background:#fff;border:1px solid var(--line);border-radius:20px;box-shadow:0 30px 80px rgba(15,27,76,.25)}
.prescription-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:22px}
.prescription-header h4{margin:0;font-family:'Plus Jakarta Sans','Inter',sans-serif;font-size:22px;font-weight:800;letter-spacing:-.4px;color:var(--ink)}
.close-btn{width:36px;height:36px;display:grid;place-items:center;border:1px solid var(--line);border-radius:10px;background:#fff;font-size:22px;line-height:1;color:var(--muted);cursor:pointer;transition:background .2s,color .2s}
.close-btn:hover{background:var(--card-2);color:var(--ink)}
.prescription-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
.prescription-field label{display:block;margin-bottom:7px;font-size:13px;font-weight:600;color:var(--ink)}
.medicine-title{margin-bottom:10px;font-size:15px;font-weight:700;color:var(--ink)}
.medicine-row{display:grid;grid-template-columns:1.3fr 1fr 1fr 1fr 42px;gap:10px;margin-bottom:10px;align-items:center}
.medicine-row input{height:46px}
.remove-medicine{width:42px;height:42px;border:0;border-radius:10px;background:transparent;color:var(--danger);font-size:22px;cursor:pointer;transition:background .2s}
.remove-medicine:hover:not(:disabled){background:rgba(220,38,38,.08)}
.remove-medicine:disabled{opacity:.3;cursor:not-allowed}
.add-medicine-btn{margin-top:5px}
.prescription-footer{display:flex;justify-content:flex-end;gap:10px;margin-top:26px;padding-top:20px;border-top:1px solid var(--line)}
.prescription-footer button{min-width:120px}
.spinner-border{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
@media (max-width:700px){.prescription-popup{padding:18px}.prescription-row,.medicine-row{grid-template-columns:1fr}}
</style>


  <!-- ========================= -->
  <!-- PRESCRIPTION HEADER -->
  <!-- ========================= -->

  <div
    class="d-flex justify-content-between align-items-center mb-3"
  >

    <h5 class="mb-0">

      Prescriptions

      <span class="text-muted fw-normal">
        ({{ prescriptions.length }})
      </span>

    </h5>


    <button
      class="btn btn-success btn-sm"
      type="button"
      (click)="openPrescriptionForm()"
    >

      <i class="bi bi-plus-lg"></i>

      Add Prescription

    </button>

  </div>


  <!-- ========================= -->
  <!-- PRESCRIPTION TABLE -->
  <!-- ========================= -->

  <div class="app-card">

    <table class="table table-clean mb-0">

      <thead>

        <tr>

          <th>Patient</th>

          <th>Doctor</th>

          <th>Diagnosis</th>

          <th>Medicines</th>

          <th>Created</th>

        </tr>

      </thead>


      <tbody>

        <tr
          *ngFor="let p of prescriptions"
        >

          <td class="fw-medium">
            {{ p.patient_name }}
          </td>

          <td>
            {{ p.doctor_name || '—' }}
          </td>

          <td>
            {{ p.diagnosis }}
          </td>

          <td>
            {{ p.items.length }} item(s)
          </td>

          <td>
            {{ p.created_at | date:'mediumDate' }}
          </td>

        </tr>


        <tr
          *ngIf="!loading && prescriptions.length === 0"
        >

          <td
            colspan="5"
            class="text-center text-muted py-4"
          >

            No prescriptions found.

          </td>

        </tr>

      </tbody>

    </table>

  </div>



  <!-- ========================= -->
  <!-- ADD PRESCRIPTION POPUP -->
  <!-- ========================= -->

  <div
    *ngIf="showPrescriptionForm"
    class="prescription-overlay"
  >

    <div class="prescription-popup">


      <!-- HEADER -->

      <div class="prescription-header">

        <h4>
          New Prescription
        </h4>

        <button
          type="button"
          class="close-btn"
          [disabled]="saving"
          (click)="closePrescriptionForm()"
        >
          ×
        </button>

      </div>


      <!-- FORM -->

      <form
        #prescriptionForm="ngForm"
        (ngSubmit)="savePrescription()"
      >


        <!-- PATIENT + DOCTOR -->

        <div class="prescription-row">


          <div class="prescription-field">

            <label>
              Patient *
            </label>

            <select
              class="form-select"
              name="patient"
              [(ngModel)]="prescription.patient"
              required
            >

              <option
                [ngValue]="null"
              >
                Select a patient
              </option>

              <option
                *ngFor="let patient of patients"
                [ngValue]="patient.id"
              >

                {{ patient.full_name }}

              </option>

            </select>

          </div>



          <div class="prescription-field">

            <label>
              Doctor
            </label>

            <select
              class="form-select"
              name="doctor"
              [(ngModel)]="prescription.doctor"
            >

              <option
                [ngValue]="null"
              >
                Select a doctor
              </option>

              <option
                *ngFor="let doctor of doctors"
                [ngValue]="doctor.id"
              >

                {{ doctor.name }}

              </option>

            </select>

          </div>

        </div>



        <!-- DIAGNOSIS + NOTES -->

        <div class="prescription-row">


          <div class="prescription-field">

            <label>
              Diagnosis *
            </label>

            <input
              type="text"
              class="form-control"
              name="diagnosis"
              [(ngModel)]="prescription.diagnosis"
              placeholder="Enter diagnosis"
              required
            >

          </div>



          <div class="prescription-field">

            <label>
              Notes
            </label>

            <input
              type="text"
              class="form-control"
              name="notes"
              [(ngModel)]="prescription.notes"
              placeholder="Enter notes"
            >

          </div>

        </div>



        <!-- MEDICINES -->

        <div class="medicine-title">

          Medicines

        </div>


        <div
          class="medicine-row"
          *ngFor="let medicine of prescription.items; let i = index"
        >


          <input
            type="text"
            class="form-control"
            [name]="'medicine_name_' + i"
            [(ngModel)]="medicine.medicine_name"
            placeholder="Medicine"
            required
          >


          <input
            type="text"
            class="form-control"
            [name]="'dosage_' + i"
            [(ngModel)]="medicine.dosage"
            placeholder="Dosage"
            required
          >


          <input
            type="text"
            class="form-control"
            [name]="'frequency_' + i"
            [(ngModel)]="medicine.frequency"
            placeholder="Frequency"
            required
          >


          <input
            type="text"
            class="form-control"
            [name]="'duration_' + i"
            [(ngModel)]="medicine.duration"
            placeholder="Duration"
            required
          >


          <button
            type="button"
            class="remove-medicine"
            (click)="removeMedicine(i)"
            [disabled]="prescription.items.length === 1"
          >

            ×

          </button>

        </div>



        <!-- ADD MEDICINE BUTTON -->

        <button
          type="button"
          class="btn btn-outline-primary btn-sm add-medicine-btn"
          (click)="addMedicine()"
        >

          <i class="bi bi-plus-lg"></i>

          Add Medicine

        </button>



        <!-- FOOTER -->

        <div class="prescription-footer">


          <button
            type="button"
            class="btn btn-outline-secondary"
            [disabled]="saving"
            (click)="closePrescriptionForm()"
          >

            Cancel

          </button>


          <button
            type="submit"
            class="btn btn-success"
            [disabled]="saving || prescriptionForm.invalid"
          >

            <span
              *ngIf="saving"
              class="spinner-border spinner-border-sm me-1"
            ></span>

            {{
              saving
                ? 'Saving...'
                : 'Save Prescription'
            }}

          </button>

        </div>


      </form>

    </div>

  </div>

  `,

})
export class PrescriptionListComponent implements OnInit {


  prescriptions: Prescription[] = [];

  patients: Patient[] = [];

  doctors: Doctor[] = [];


  loading = true;

  saving = false;

  showPrescriptionForm = false;


  prescription: any = {

    patient: null,

    doctor: null,

    diagnosis: '',

    notes: '',

    items: [

      {
        medicine_name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      }

    ]

  };


  private apiUrl = environment.apiUrl;


  constructor(
    private prescriptionService: PrescriptionService,
    private http: HttpClient
  ) {}


  ngOnInit(): void {

    this.fetch();

  }


  // =========================
  // LOAD PRESCRIPTIONS
  // =========================

  fetch(): void {

    this.loading = true;

    this.prescriptionService.list().subscribe({

      next: (res) => {

        this.prescriptions = res.results;

        this.loading = false;

      },

      error: (err) => {

        console.error(
          'Error loading prescriptions:',
          err
        );

        this.loading = false;

      }

    });

  }


  // =========================
  // OPEN FORM
  // =========================

  openPrescriptionForm(): void {

    this.prescription = {

      patient: null,

      doctor: null,

      diagnosis: '',

      notes: '',

      items: [

        {
          medicine_name: '',
          dosage: '',
          frequency: '',
          duration: '',
          instructions: ''
        }

      ]

    };


    this.showPrescriptionForm = true;


    this.loadPatients();

    this.loadDoctors();

  }


  // =========================
  // CLOSE FORM
  // =========================

  closePrescriptionForm(): void {

    if (!this.saving) {

      this.showPrescriptionForm = false;

    }

  }


  // =========================
  // LOAD PATIENTS
  // =========================

  loadPatients(): void {

    this.http
      .get<any>(`${this.apiUrl}/patients/`)
      .subscribe({

        next: (res) => {

          this.patients =
            res.results || res || [];

        },

        error: (err) => {

          console.error(
            'Patient API Error:',
            err
          );

        }

      });

  }


  // =========================
  // LOAD DOCTORS
  // =========================

  loadDoctors(): void {

    this.http
      .get<any>(`${this.apiUrl}/doctors/`)
      .subscribe({

        next: (res) => {

          this.doctors =
            res.results || res || [];

        },

        error: (err) => {

          console.error(
            'Doctor API Error:',
            err
          );

        }

      });

  }


  // =========================
  // ADD MEDICINE
  // =========================

  addMedicine(): void {

    this.prescription.items.push({

      medicine_name: '',

      dosage: '',

      frequency: '',

      duration: '',

      instructions: ''

    });

  }


  // =========================
  // REMOVE MEDICINE
  // =========================

  removeMedicine(index: number): void {

    if (this.prescription.items.length > 1) {

      this.prescription.items.splice(index, 1);

    }

  }


  // =========================
  // SAVE PRESCRIPTION
  // =========================

  savePrescription(): void {


    if (!this.prescription.patient) {

      alert('Please select a patient.');

      return;

    }


    if (!this.prescription.diagnosis) {

      alert('Please enter diagnosis.');

      return;

    }


    if (
      !this.prescription.items ||
      this.prescription.items.length === 0
    ) {

      alert('Please add at least one medicine.');

      return;

    }


    const invalidMedicine =
      this.prescription.items.some(
        (item: any) =>
          !item.medicine_name ||
          !item.dosage ||
          !item.frequency ||
          !item.duration
      );


    if (invalidMedicine) {

      alert(
        'Please fill all medicine fields.'
      );

      return;

    }


    this.saving = true;


    const payload = {

      patient: Number(
        this.prescription.patient
      ),

      doctor:
        this.prescription.doctor
          ? Number(this.prescription.doctor)
          : null,

      diagnosis:
        this.prescription.diagnosis,

      notes:
        this.prescription.notes || '',

      items:
        this.prescription.items.map(
          (item: any) => ({

            medicine_name:
              item.medicine_name,

            dosage:
              item.dosage,

            frequency:
              item.frequency,

            duration:
              item.duration,

            instructions:
              item.instructions || ''

          })
        )

    };


    console.log(
      'Prescription Payload:',
      payload
    );


    this.prescriptionService
      .create(payload)
      .subscribe({

        next: (created) => {

          console.log(
            'Prescription created:',
            created
          );


          this.saving = false;

          this.showPrescriptionForm = false;


          this.fetch();


          alert(
            'Prescription added successfully.'
          );

        },


        error: (err) => {

          console.error(
            'PRESCRIPTION CREATE ERROR:',
            err
          );

          console.error(
            'STATUS:',
            err.status
          );

          console.error(
            'ERROR:',
            err.error
          );


          this.saving = false;


          const backendError =
            typeof err.error === 'string'
              ? err.error
              : JSON.stringify(
                  err.error,
                  null,
                  2
                );


          alert(
            `Prescription API Error\n\nStatus: ${err.status}\n\n${backendError}`
          );

        }

      });

  }

}