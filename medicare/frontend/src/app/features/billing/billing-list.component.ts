import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BillingService } from '../../core/services/billing.service';
import { Invoice, Patient, InvoiceStatus } from '../../core/models';

@Component({
  selector: 'app-billing-list',
  standalone: true,
  imports: [CommonModule, FormsModule],

  template: `
    <!-- Billing list: purane <style>...</style> ki jagah -->
<!-- billing-list.component.ts ke template ke andar wala <style> block isse replace karo -->
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

/* status pill */
.badge{display:inline-flex;align-items:center;gap:7px;padding:5px 12px;border-radius:999px;font-size:12px;font-weight:700;text-transform:capitalize;color:#475569;background:#EEF2F7}
.badge::before{content:"";width:7px;height:7px;border-radius:50%;background:currentColor}
.spinner-border{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.billing-overlay{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(15,27,76,.38);backdrop-filter:blur(4px)}

/* ===== popup ===== */
.billing-modal{max-width:650px;padding:28px;width:100%;max-height:90vh;overflow-y:auto;color:var(--text);background:#fff;border:1px solid var(--line);border-radius:20px;box-shadow:0 30px 80px rgba(15,27,76,.25)}
.billing-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:22px}
.billing-header h4{margin:0;font-family:'Plus Jakarta Sans','Inter',sans-serif;font-size:22px;font-weight:800;letter-spacing:-.4px;color:var(--ink)}
.close-btn{width:36px;height:36px;display:grid;place-items:center;border:1px solid var(--line);border-radius:10px;background:#fff;font-size:22px;line-height:1;color:var(--muted);cursor:pointer;transition:background .2s,color .2s}
.close-btn:hover{background:var(--card-2);color:var(--ink)}
.billing-field{margin-bottom:16px}
.billing-field label{display:block;margin-bottom:7px;font-size:13px;font-weight:600;color:var(--ink)}
.billing-field input,.billing-field select,.invoice-item input{width:100%;height:46px;padding:0 14px;border:1.5px solid var(--field-line);border-radius:12px;outline:none;font:inherit;font-size:14px;color:var(--ink);background:var(--field);box-sizing:border-box;transition:border-color .2s,box-shadow .2s,background .2s}
.billing-field input::placeholder,.invoice-item input::placeholder{color:#8591AE}
.billing-field select option{background:#fff;color:var(--ink)}
.billing-field input:focus,.billing-field select:focus,.invoice-item input:focus{border-color:var(--green-d);background:#fff;box-shadow:0 0 0 4px rgba(15,157,107,.13)}
.billing-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.invoice-items{margin-top:10px}
.invoice-item{display:grid;grid-template-columns:1fr 140px 40px;gap:10px;margin-bottom:10px}
.remove-item{border:0;border-radius:10px;background:transparent;color:var(--danger);font-size:24px;cursor:pointer;transition:background .2s}
.remove-item:hover{background:rgba(220,38,38,.08)}
.add-item-btn{margin-top:5px;padding:9px 14px;border:1.5px dashed #BFE8D2;border-radius:10px;background:#F4FCF8;color:var(--green-d);font:inherit;font-size:13px;font-weight:700;cursor:pointer;transition:background .2s,border-color .2s}
.add-item-btn:hover{background:#E6F6EE;border-color:var(--green-d)}
.total-box{display:flex;justify-content:space-between;align-items:center;margin-top:18px;padding:16px 18px;border-radius:14px;font-size:16px;font-weight:700;color:var(--ink);background:#EAF8F0;border:1px solid #CBEBD9}
.total-box span:last-child{font-family:'Plus Jakarta Sans',sans-serif;font-size:22px;font-weight:800;color:var(--green-d)}
.billing-footer{display:flex;justify-content:flex-end;gap:10px;margin-top:24px;padding-top:20px;border-top:1px solid var(--line)}
.billing-footer .btn{min-width:120px}
@media (max-width:650px){.billing-row,.invoice-item{grid-template-columns:1fr}.billing-modal{padding:20px}}
</style>


    <!-- BILLING HEADER -->

    <div class="d-flex justify-content-between align-items-center mb-3">

      <h5 class="mb-0">
        Billing
        <span class="text-muted fw-normal">
          ({{ invoices.length }})
        </span>
      </h5>

      <button
        class="btn btn-success btn-sm"
        type="button"
        (click)="openInvoiceForm()"
      >
        <i class="bi bi-plus-lg"></i>
        Generate Invoice
      </button>

    </div>


    <!-- BILLING TABLE -->

    <div class="app-card">

      <table class="table table-clean mb-0">

        <thead>
          <tr>
            <th>Patient</th>
            <th>Subtotal</th>
            <th>Discount</th>
            <th>Total</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>

          <tr *ngFor="let inv of invoices">

            <td class="fw-medium">
              {{ inv.patient_name }}
            </td>

            <td>
              ₹{{ inv.subtotal }}
            </td>

            <td>
              ₹{{ inv.discount }}
            </td>

            <td>
              ₹{{ inv.total }}
            </td>

            <td>
              <span class="badge text-bg-secondary">
                {{ inv.status }}
              </span>
            </td>

            <td>
              {{ inv.created_at | date:'mediumDate' }}
            </td>

          </tr>


          <tr *ngIf="!loading && invoices.length === 0">

            <td
              colspan="6"
              class="text-center text-muted py-4"
            >
              No invoices found.
            </td>

          </tr>

        </tbody>

      </table>

    </div>


    <!-- GENERATE INVOICE POPUP -->

    <div
      *ngIf="showInvoiceForm"
      class="billing-overlay"
    >

      <div class="billing-modal">

        <!-- HEADER -->

        <div class="billing-header">

          <h4>
            Generate Invoice
          </h4>

          <button
            type="button"
            class="close-btn"
            [disabled]="saving"
            (click)="closeInvoiceForm()"
          >
            ×
          </button>

        </div>


        <form
          #invoiceForm="ngForm"
          (ngSubmit)="saveInvoice()"
        >

          <!-- PATIENT -->

          <div class="billing-field">

            <label>
              Patient
            </label>

            <select
              name="patient"
              [(ngModel)]="invoice.patient"
              required
            >

              <option [ngValue]="null">
                Select patient
              </option>

              <option
                *ngFor="let p of patients"
                [ngValue]="p.id"
              >
                {{ p.full_name }}
              </option>

            </select>

          </div>


          <!-- ITEMS -->

          <div class="billing-field">

            <label>
              Invoice Items
            </label>

            <div class="invoice-items">

              <div
                class="invoice-item"
                *ngFor="let item of invoice.items; let i = index"
              >

                <input
                  type="text"
                  [name]="'description' + i"
                  [(ngModel)]="item.description"
                  placeholder="Description"
                  required
                >

                <input
                  type="number"
                  [name]="'amount' + i"
                  [(ngModel)]="item.amount"
                  placeholder="Amount"
                  min="0"
                  required
                >

                <button
                  type="button"
                  class="remove-item"
                  (click)="removeItem(i)"
                  *ngIf="invoice.items.length > 1"
                >
                  ×
                </button>

              </div>

            </div>


            <button
              type="button"
              class="add-item-btn"
              (click)="addItem()"
            >
              + Add Item
            </button>

          </div>


          <!-- DISCOUNT -->

          <div class="billing-row">

            <div class="billing-field">

              <label>
                Discount (₹)
              </label>

              <input
                type="number"
                name="discount"
                [(ngModel)]="invoice.discount"
                (ngModelChange)="calculateTotal()"
                min="0"
              >

            </div>


            <div class="billing-field">

              <label>
                Payment Status
              </label>

              <select
                name="status"
                [(ngModel)]="invoice.status"
              >

                <option value="pending">
                  Pending
                </option>

                <option value="paid">
                  Paid
                </option>

                <option value="partial">
                  Partial
                </option>

                <option value="cancelled">
                  Cancelled
                </option>

              </select>

            </div>

          </div>


          <!-- TOTAL -->

          <div class="total-box">

            <span>
              Total
            </span>

            <span>
              ₹{{ total }}
            </span>

          </div>


          <!-- FOOTER -->

          <div class="billing-footer">

            <button
              type="button"
              class="btn btn-outline-light"
              [disabled]="saving"
              (click)="closeInvoiceForm()"
            >
              Cancel
            </button>


            <button
              type="submit"
              class="btn btn-success"
              [disabled]="saving || invoiceForm.invalid || !invoice.patient"
            >

              <span
                *ngIf="saving"
                class="spinner-border spinner-border-sm me-1"
              ></span>

              {{ saving ? 'Generating...' : 'Generate' }}

            </button>

          </div>

        </form>

      </div>

    </div>
  `,

})
export class BillingListComponent implements OnInit {

  invoices: Invoice[] = [];

  patients: Patient[] = [];

  loading = true;

  saving = false;

  showInvoiceForm = false;

  total = 0;


  invoice: {
    patient: number | null;
    appointment: number | null;
    items: {
      description: string;
      amount: number;
    }[];
    discount: number;
    status: InvoiceStatus;
  } = {

    patient: null,

    appointment: null,

    items: [
      {
        description: '',
        amount: 0
      }
    ],

    discount: 0,

    status: 'pending'

  };


  constructor(
    private billingService: BillingService
  ) {}


  ngOnInit(): void {

    this.fetch();

    this.fetchPatients();

  }


  fetch(): void {

    this.loading = true;

    this.billingService.list().subscribe({

      next: (res) => {

        this.invoices = res.results;

        this.loading = false;

      },

      error: (err) => {

        console.error('Error loading invoices:', err);

        this.loading = false;

      }

    });

  }


  fetchPatients(): void {

    this.billingService.getPatients().subscribe({

      next: (res) => {

        this.patients = res.results;

      },

      error: (err) => {

        console.error('Error loading patients:', err);

      }

    });

  }


  openInvoiceForm(): void {

    this.invoice = {

      patient: null,

      appointment: null,

      items: [
        {
          description: '',
          amount: 0
        }
      ],

      discount: 0,

      status: 'pending'

    };

    this.total = 0;

    this.showInvoiceForm = true;

  }


  closeInvoiceForm(): void {

    if (!this.saving) {

      this.showInvoiceForm = false;

    }

  }


  addItem(): void {

    this.invoice.items.push({

      description: '',

      amount: 0

    });

  }


  removeItem(index: number): void {

    if (this.invoice.items.length > 1) {

      this.invoice.items.splice(index, 1);

      this.calculateTotal();

    }

  }


  calculateTotal(): void {

    const subtotal = this.invoice.items.reduce(

      (sum, item) => sum + (Number(item.amount) || 0),

      0

    );

    this.total = Math.max(

      0,

      subtotal - (Number(this.invoice.discount) || 0)

    );

  }


  saveInvoice(): void {

    if (!this.invoice.patient) {

      alert('Please select a patient.');

      return;

    }


    if (this.invoice.items.length === 0) {

      alert('Please add at least one item.');

      return;

    }


    const invalidItem = this.invoice.items.some(

      item =>

        !item.description?.trim() ||

        Number(item.amount) <= 0

    );


    if (invalidItem) {

      alert('Please enter description and valid amount for every item.');

      return;

    }


    this.calculateTotal();

    this.saving = true;


    const subtotal = this.invoice.items.reduce(

      (sum, item) => sum + Number(item.amount),

      0

    );


    const payload = {

      patient: this.invoice.patient,

      appointment: this.invoice.appointment,

      items: this.invoice.items.map(item => ({

        description: item.description,

        amount: Number(item.amount)

      })),

      subtotal: subtotal,

      discount: Number(this.invoice.discount) || 0,

      total: this.total,

      status: this.invoice.status

    };


    this.billingService.create(payload).subscribe({

      next: (createdInvoice) => {

        console.log('Invoice created:', createdInvoice);

        this.saving = false;

        this.showInvoiceForm = false;

        this.fetch();

      },

      error: (err) => {

        console.error('INVOICE CREATE ERROR:', err);

        console.error('STATUS:', err.status);

        console.error('ERROR BODY:', err.error);

        this.saving = false;

        const backendError =
          typeof err.error === 'string'
            ? err.error
            : JSON.stringify(err.error, null, 2);

        alert(
          `Billing API Error\n\nStatus: ${err.status}\n\n${backendError}`
        );

      }

    });

  }

}