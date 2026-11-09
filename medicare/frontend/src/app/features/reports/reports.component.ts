import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardStatistics } from '../../core/models';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <!-- Reports: template ke sabse upar -->
<!-- reports.component.ts ke template ke andar wala <style> block isse replace karo -->
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

/* range select */
.form-select-sm{height:40px;width:auto;min-width:160px;font-size:13px;font-weight:600;background-color:#fff;border-color:var(--line)}

/* stat cards -> 4 equal columns, tinted like the dashboard */
.row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin:0;--bs-gutter-x:0;--bs-gutter-y:0}
.row > *{width:auto;max-width:none;margin:0;padding:0}
.row .app-card{position:relative;overflow:hidden;height:100%;min-height:128px;padding:18px;background:color-mix(in srgb,var(--c) 7%,#fff);border-color:color-mix(in srgb,var(--c) 26%,#fff)}
.row .app-card::after{content:"";position:absolute;right:-46px;top:-46px;width:140px;height:140px;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--c) 22%,transparent),transparent 70%);opacity:.6;pointer-events:none;transition:opacity .3s,transform .4s}
.row .app-card:hover::after{opacity:1;transform:scale(1.25)}
.row > *:nth-child(1) .app-card{--c:#16A34A}
.row > *:nth-child(2) .app-card{--c:#3B82F6}
.row > *:nth-child(3) .app-card{--c:#7C5CE0}
.row > *:nth-child(4) .app-card{--c:#F59E0B}
.row .app-card .small{position:relative;z-index:1;font-size:13.5px;font-weight:500;color:var(--text)!important}
.row .app-card .fs-4{position:relative;z-index:1;margin-top:14px;font-family:'Plus Jakarta Sans',sans-serif;font-size:32px!important;font-weight:800;line-height:1;letter-spacing:-1px;color:var(--ink)}
.mt-3{margin-top:16px}
@media (max-width:950px){.row{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:520px){.row{grid-template-columns:1fr}}
</style>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="mb-0">Reports</h5>
      <select class="form-select form-select-sm w-auto" [(ngModel)]="range" (ngModelChange)="fetch()">
        <option value="today">Today</option>
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
      </select>
    </div>

    <div class="row g-3" *ngIf="stats">
      <div class="col-md-3"><div class="app-card"><div class="text-muted small">Total Patients</div><div class="fs-4 fw-bold">{{ stats.cards.total_patients }}</div></div></div>
      <div class="col-md-3"><div class="app-card"><div class="text-muted small">Appointments</div><div class="fs-4 fw-bold">{{ stats.cards.appointments }}</div></div></div>
      <div class="col-md-3"><div class="app-card"><div class="text-muted small">Available Doctors</div><div class="fs-4 fw-bold">{{ stats.cards.available_doctors }}</div></div></div>
      <div class="col-md-3"><div class="app-card"><div class="text-muted small">Revenue</div><div class="fs-4 fw-bold">{{ stats.revenue }}</div></div></div>
    </div>

    <div class="app-card mt-3" *ngIf="stats">
      <h6>Doctor performance</h6>
      <table class="table table-clean mb-0">
        <thead><tr><th>Doctor</th><th>Appointments</th><th>Completed</th></tr></thead>
        <tbody>
          <tr *ngFor="let d of stats.doctor_performance">
            <td>{{ d.name }}</td><td>{{ d.appt_count }}</td><td>{{ d.completed_count }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class ReportsComponent implements OnInit {
  stats: DashboardStatistics | null = null;
  range: 'today' | '7d' | '30d' = 'today';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void { this.fetch(); }

  fetch(): void {
    this.dashboardService.getStatistics(this.range).subscribe({
      next: (res) => (this.stats = res),
    });
  }
}
