import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardStatistics } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],

  template: `
    <div class="dashboard-page">

      <svg width="0" height="0" style="position:absolute" aria-hidden="true">
        <symbol id="i-users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.3c2.2.7 3.5 2.6 3.5 5.7"/></symbol>
        <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></symbol>
        <symbol id="i-cal" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4M9 15.5l2 2 4-4"/></symbol>
        <symbol id="i-pulse" viewBox="0 0 24 24"><path d="M20.8 8.6c0 5.5-8.8 11.4-8.8 11.4S3.2 14.1 3.2 8.6A4.6 4.6 0 0 1 12 6.4a4.6 4.6 0 0 1 8.8 2.2z"/><path d="M6.5 12h3l1.5-2.5 2 5 1.5-2.5h3"/></symbol>
        <symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></symbol>
        <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>
      </svg>

      <!-- ================= HEADER ================= -->
      <div class="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, Admin 👋 Here's what's happening in your clinic today.</p>
        </div>

        <div class="header-actions">
          <div class="range-switcher">
            <button [class.active]="range === 'today'" (click)="setRange('today')">Today</button>
            <button [class.active]="range === '7d'" (click)="setRange('7d')">7 Days</button>
            <button [class.active]="range === '30d'" (click)="setRange('30d')">30 Days</button>
          </div>

          <button type="button" class="btn-outline" (click)="goToAppointments()">
            <svg class="ic sm"><use href="#i-plus"/></svg>New Appointment
          </button>

          <button type="button" class="btn-solid" (click)="goToPatients()">
            <svg class="ic sm"><use href="#i-plus"/></svg>Register Patient
          </button>
        </div>
      </div>

      <div class="loading-box" *ngIf="loading">
        <div class="loading-spinner"></div>
        <span>Loading dashboard...</span>
      </div>

      <ng-container *ngIf="stats as s">
      <div class="page-grid">

        <!-- ================= MAIN COLUMN ================= -->
        <div class="main-col">

          <!-- Stat cards -->
          <div class="stats-grid">

            <div class="stat-card c-green rise" style="--i:0">
              <div class="stat-head"><div class="stat-icon"><svg class="ic"><use href="#i-users"/></svg></div><span>Total Patients</span></div>
              <div class="stat-number">{{ s.cards.total_patients }}</div>
              <div class="stat-sub">↑ All registered patients</div>
            </div>

            <div class="stat-card c-sky rise" style="--i:1">
              <div class="stat-head"><div class="stat-icon"><svg class="ic"><use href="#i-cal"/></svg></div><span>Appointments</span></div>
              <div class="stat-number">{{ s.cards.appointments }}</div>
              <div class="stat-sub">↑ {{ s.appointment_status.scheduled }} scheduled</div>
            </div>

            <div class="stat-card c-amber rise" style="--i:2">
              <div class="stat-head"><div class="stat-icon rupee">₹</div><span>Pending Payments</span></div>
              <div class="stat-number">₹{{ s.cards.pending_payments }}</div>
              <div class="stat-sub">+ Awaiting payment</div>
            </div>

            <div class="stat-card c-violet rise" style="--i:3">
              <div class="stat-head"><div class="stat-icon"><svg class="ic"><use href="#i-user"/></svg></div><span>Doctors Available</span></div>
              <div class="stat-number">{{ s.cards.available_doctors }}</div>
              <div class="stat-sub">+ On duty now</div>
            </div>

          </div>


          <!-- Revenue + Appointment overview -->
          <div class="two-col">

            <div class="card rise" style="--i:4">
              <div class="card-head">
                <h2>Revenue</h2>
                <span class="pill">{{ range === 'today' ? 'Today' : range === '7d' ? 'Last 7 days' : 'Last 30 days' }}</span>
              </div>
              <div class="revenue-amount">₹{{ s.revenue }}</div>
              <div class="muted-sm">Clinic earnings</div>

              <div class="chart-empty" *ngIf="noRevenue">
                <div class="empty-icon"><svg class="ic"><use href="#i-pulse"/></svg></div>
                <strong>No revenue yet</strong>
                <span>Paid appointments will show up here.</span>
              </div>

              <ng-container *ngIf="!noRevenue">
                <div class="chart-wrap">
                  <div class="y-labels"><span>4k</span><span>3k</span><span>2k</span><span>1k</span><span>0</span></div>
                  <div class="chart-area">
                    <svg viewBox="0 0 400 160" preserveAspectRatio="none" aria-hidden="true">
                      <defs>
                        <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0" stop-color="#16A34A" stop-opacity=".28"/>
                          <stop offset="1" stop-color="#16A34A" stop-opacity="0"/>
                        </linearGradient>
                      </defs>
                      <path class="area" fill="url(#revFill)" d="M0 110 C40 60 70 40 110 70 S170 140 210 100 S280 30 320 60 S380 90 400 70 L400 160 L0 160 Z"/>
                      <path class="curve a" pathLength="1" d="M0 110 C40 60 70 40 110 70 S170 140 210 100 S280 30 320 60 S380 90 400 70"/>
                      <path class="curve b" pathLength="1" d="M0 130 C40 140 70 120 110 110 S170 40 210 70 S280 130 320 120 S380 80 400 100"/>
                    </svg>
                  </div>
                </div>
                <div class="x-labels"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div>
              </ng-container>
            </div>


            <div class="card rise" style="--i:5">
              <div class="card-head">
                <div><h2>Appointment Overview</h2><p>Current appointment status</p></div>
              </div>

              <ng-container *ngIf="s.appointment_status as a">
                <div class="bars" *ngFor="let t of [a.scheduled + a.completed + a.cancelled + a.no_show || 1]">

                  <div class="bar-col c-green">
                    <b>{{ a.scheduled }}</b>
                    <div class="bar-track"><i [style.height.%]="a.scheduled / t * 100"></i></div>
                    <span>Scheduled</span>
                  </div>
                  <div class="bar-col c-sky">
                    <b>{{ a.completed }}</b>
                    <div class="bar-track"><i [style.height.%]="a.completed / t * 100"></i></div>
                    <span>Completed</span>
                  </div>
                  <div class="bar-col c-red">
                    <b>{{ a.cancelled }}</b>
                    <div class="bar-track"><i [style.height.%]="a.cancelled / t * 100"></i></div>
                    <span>Cancelled</span>
                  </div>
                  <div class="bar-col c-amber">
                    <b>{{ a.no_show }}</b>
                    <div class="bar-track"><i [style.height.%]="a.no_show / t * 100"></i></div>
                    <span>No Show</span>
                  </div>

                </div>
                <div class="bars-hint" *ngIf="a.scheduled + a.completed + a.cancelled + a.no_show === 0">
                  No appointments yet. Bars fill up as you book them.
                </div>
              </ng-container>
            </div>

          </div>


          <!-- Doctor performance + Alerts -->
          <div class="two-col">

            <div class="card rise" style="--i:6">
              <div class="card-head"><div><h2>Doctor Performance</h2><p>Appointment activity by doctor</p></div></div>

              <div class="list">
                <div class="list-row" *ngFor="let d of s.doctor_performance">
                  <div class="doctor-avatar">{{ d.name.charAt(0).toUpperCase() }}</div>
                  <div class="list-main">
                    <strong>{{ d.name }}</strong>
                    <span>{{ d.completed_count }} of {{ d.appt_count }} appointments completed</span>
                    <div class="performance-bar"><div class="performance-fill" [style.width.%]="d.appt_count > 0 ? (d.completed_count / d.appt_count) * 100 : 0"></div></div>
                  </div>
                  <span class="chip">{{ d.appt_count > 0 ? ((d.completed_count / d.appt_count) * 100).toFixed(0) : 0 }}%</span>
                </div>

                <div class="empty-state" *ngIf="s.doctor_performance.length === 0">
                  <div class="empty-icon"><svg class="ic"><use href="#i-pulse"/></svg></div>
                  <strong>No doctor data yet</strong>
                  <span>Add doctors and appointments to see performance.</span>
                </div>
              </div>
            </div>


            <div class="card rise" style="--i:7">
              <div class="card-head"><div><h2>Alerts &amp; Notifications</h2><p>Important updates</p></div></div>

              <div class="alert c-green"><i></i>{{ s.appointment_status.scheduled }} appointments are scheduled</div>
              <div class="alert c-red"><i></i>{{ s.appointment_status.no_show }} patients did not show up</div>
              <div class="alert c-amber"><i></i>₹{{ s.cards.pending_payments }} in payments pending</div>

              <div class="kpi"><span>Doctors available</span><strong>{{ s.cards.available_doctors }}</strong></div>
              <div class="kpi"><span>Completed appointments</span><strong>{{ s.appointment_status.completed }}</strong></div>
            </div>

          </div>

        </div>


        <!-- ================= SIDE COLUMN ================= -->
        <aside class="side-col">

          <!-- Calendar with month arrows -->
          <div class="card calendar rise" style="--i:2">
            <div class="cal-head">
              <div class="cal-title">{{ calTitle }}</div>
              <div class="cal-nav">
                <button type="button" aria-label="Previous month" (click)="shiftMonth(-1)">‹</button>
                <button type="button" aria-label="Next month" (click)="shiftMonth(1)">›</button>
              </div>
            </div>
            <div class="cal-grid">
              <span class="dow" *ngFor="let w of ['S','M','T','W','T','F','S']">{{ w }}</span>
              <span class="day" *ngFor="let d of calDays"
                [style.grid-column-start]="d === 1 ? firstDow + 1 : null"
                [class.today]="isCurrentMonth && d === todayDate"
                [class.sun]="(firstDow + d - 1) % 7 === 0">{{ d }}</span>
            </div>
          </div>

          <!-- Doctors timeline -->
          <div class="timeline">
            <div class="tl-item rise" *ngFor="let d of s.doctor_performance | slice:0:4; let i = index" [style.--i]="i + 4">
              <div class="tl-card">
                <div class="tl-avatar"><svg class="ic"><use href="#i-user"/></svg></div>
                <div class="tl-body">
                  <div class="tl-top"><strong>{{ d.name }}</strong><span>{{ d.appt_count }} appts</span></div>
                  <p>{{ d.completed_count }} completed · Medical Staff</p>
                </div>
                <span class="tl-check"><svg class="ic"><use href="#i-check"/></svg></span>
              </div>
            </div>
          </div>

        </aside>

      </div>
      </ng-container>

    </div>
  `,

  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@700;800&display=swap');

    :host {
      --green: #16A34A; --green-d: #0F9D6B; --mint: #34C58F;
      --ink: #0F1B4C; --text: #26335A; --muted: #6B7A99;
      --card: #FFFFFF; --line: #E3EEE8; --soft: #F1FAF5;
      display: block; width: 100%;
    }
    * { box-sizing: border-box; }

    /* ---- colours ---- */
    .c-green  { --c: #16A34A; }
    .c-sky    { --c: #3B82F6; }
    .c-amber  { --c: #F59E0B; }
    .c-violet { --c: #7C5CE0; }
    .c-red    { --c: #EF4444; }

    .ic { width: 20px; height: 20px; flex-shrink: 0; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
    .ic.sm { width: 16px; height: 16px; stroke-width: 2.2; }
    .rupee { font-size: 19px; font-weight: 800; }

    .dashboard-page { width: 100%; color: var(--text); font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; }
    h1, h2, .stat-number, .revenue-amount, .cal-title { color: var(--ink); font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }

    /* ---- animations ---- */
    .rise { animation: rise .7s cubic-bezier(.2,.7,.2,1) backwards; animation-delay: calc(var(--i, 0) * 70ms + 80ms); }
    @keyframes rise { from { opacity: 0; transform: translateY(18px); } }
    @keyframes draw { from { stroke-dashoffset: 1; } }
    @keyframes fade { from { opacity: 0; } }
    @keyframes growY { from { transform: scaleY(0); } }
    @keyframes growX { from { transform: scaleX(0); } }
    @keyframes ping { 0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--c, #16A34A) 45%, transparent); } 70%, 100% { box-shadow: 0 0 0 9px transparent; } }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ---- header ---- */
    .dashboard-header { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 22px; flex-wrap: wrap; }
    .dashboard-header h1 { margin: 0; font-size: 32px; line-height: 1.15; font-weight: 800; letter-spacing: -1px; }
    .dashboard-header p { margin: 6px 0 0; color: var(--muted); font-size: 14.5px; }
    .header-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

    .range-switcher { display: flex; gap: 2px; padding: 4px; background: #fff; border: 1px solid var(--line); border-radius: 12px; }
    .range-switcher button { border: 0; background: transparent; color: var(--muted); padding: 9px 16px; border-radius: 9px; font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; transition: background .2s, color .2s; }
    .range-switcher button:hover { color: var(--ink); }
    .range-switcher button.active { color: #fff; background: var(--green-d); box-shadow: 0 4px 12px rgba(15,157,107,.3); }

    .btn-outline, .btn-solid { height: 44px; display: inline-flex; align-items: center; gap: 8px; padding: 0 18px; border-radius: 11px; font: inherit; font-size: 13.5px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: transform .2s, box-shadow .2s; }
    .btn-outline { color: var(--ink); background: #fff; border: 1px solid var(--line); }
    .btn-solid { color: #fff; border: 0; background: linear-gradient(135deg, #10A56F, #0B8F5F); box-shadow: 0 6px 16px rgba(15,157,107,.28); }
    .btn-outline:hover, .btn-solid:hover { transform: translateY(-1px); }
    button:focus-visible { outline: 3px solid rgba(22,163,74,.4); outline-offset: 2px; }

    .loading-box { min-height: 300px; display: flex; align-items: center; justify-content: center; gap: 12px; color: var(--muted); font-size: 14px; }
    .loading-spinner { width: 22px; height: 22px; border-radius: 50%; border: 2.5px solid var(--line); border-top-color: var(--green); animation: spin .7s linear infinite; }

    /* ---- layout ---- */
    .page-grid { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 20px; align-items: start; }
    .main-col { min-width: 0; display: grid; gap: 16px; }
    .side-col { min-width: 0; display: grid; gap: 16px; position: sticky; top: 92px; align-self: start; }
    .two-col { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; align-items: stretch; }
    .two-col > .card { min-width: 0; height: 100%; }

    .card { min-width: 0; background: var(--card); border: 1px solid var(--line); border-radius: 18px; padding: 20px; box-shadow: 0 8px 26px -18px rgba(15,157,107,.35); }
    .card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
    .card-head h2 { margin: 0 0 4px; font-size: 17px; font-weight: 800; letter-spacing: -.3px; }
    .card-head p, .muted-sm { margin: 0; color: var(--muted); font-size: 13px; }
    .pill { flex-shrink: 0; padding: 5px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; color: var(--green-d); background: #DDF5E8; }

    /* ---- stat cards ---- */
    .stats-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
    .stat-card { min-width: 0; padding: 18px; border-radius: 18px; background: color-mix(in srgb, var(--c) 7%, #fff); border: 1px solid color-mix(in srgb, var(--c) 26%, #fff); transition: transform .25s, box-shadow .25s; }
    .stat-card:hover { transform: translateY(-4px); box-shadow: 0 16px 28px -18px color-mix(in srgb, var(--c) 70%, transparent); }
    .stat-head { display: flex; align-items: center; gap: 12px; color: var(--text); font-size: 13.5px; font-weight: 500; }
    .stat-icon { width: 38px; height: 38px; flex-shrink: 0; display: grid; place-items: center; border-radius: 11px; color: var(--c); background: color-mix(in srgb, var(--c) 16%, #fff); }
    .stat-number { margin: 16px 0 8px; font-size: 32px; font-weight: 800; line-height: 1; letter-spacing: -1px; }
    .stat-sub { font-size: 12.5px; font-weight: 600; color: color-mix(in srgb, var(--c) 85%, #0F1B4C); }

    /* ---- revenue ---- */
    .revenue-amount { margin-top: 2px; font-size: 34px; font-weight: 800; line-height: 1.1; letter-spacing: -1.2px; }
    .chart-wrap { display: flex; gap: 10px; margin-top: 16px; }
    .y-labels { height: 150px; display: flex; flex-direction: column; justify-content: space-between; color: var(--muted); font-size: 11.5px; }
    .chart-area { flex: 1; min-width: 0; height: 150px; background: repeating-linear-gradient(to bottom, var(--line) 0 1px, transparent 1px 25%); }
    .chart-area svg { width: 100%; height: 100%; overflow: visible; }
    .curve { fill: none; stroke-width: 2.6; stroke-linecap: round; vector-effect: non-scaling-stroke; stroke-dasharray: 1; animation: draw 1.8s cubic-bezier(.4,0,.2,1) .5s backwards; }
    .curve.a { stroke: #16A34A; }
    .curve.b { stroke: var(--mint); animation-delay: .8s; }
    .area { animation: fade 1.4s ease 1.2s backwards; }
    .x-labels { display: flex; justify-content: space-between; margin: 8px 0 0 30px; color: var(--muted); font-size: 12px; }

    .chart-empty { margin-top: 16px; height: 170px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; border: 1.5px dashed var(--line); border-radius: 14px; }
    .chart-empty strong { font-size: 14px; color: var(--ink); }
    .chart-empty span { margin-top: 4px; color: var(--muted); font-size: 13px; }
    .bars-hint { margin-top: 12px; text-align: center; color: var(--muted); font-size: 13px; }

    /* ---- appointment bars ---- */
    .bars { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; height: 215px; align-items: end; margin-top: 4px; }
    .bar-col { min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 8px; height: 100%; }
    .bar-col b { font-size: 15px; font-weight: 800; color: var(--c); }
    .bar-col span { color: var(--text); font-size: 12.5px; font-weight: 500; white-space: nowrap; }
    .bar-track { flex: 1; width: 100%; max-width: 50px; display: flex; align-items: flex-end; border-radius: 12px; overflow: hidden; background: linear-gradient(to top, color-mix(in srgb, var(--c) 30%, #fff), color-mix(in srgb, var(--c) 12%, #fff)); }
    .bar-track i { display: block; width: 100%; min-height: 6px; border-radius: 12px; background: linear-gradient(to top, var(--c), color-mix(in srgb, var(--c) 55%, #fff)); transform-origin: bottom; animation: growY 1.1s cubic-bezier(.2,.7,.2,1) .6s backwards; }

    /* ---- doctor list ---- */
    .list { display: grid; gap: 4px; }
    .list-row { display: flex; align-items: center; gap: 12px; padding: 10px 8px; margin: 0 -8px; border-radius: 12px; transition: background .2s; }
    .list-row:hover { background: var(--soft); }
    .list-main { flex: 1; min-width: 0; color: var(--ink); }
    .list-main strong { display: block; font-size: 14px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .list-main > span { display: block; margin: 2px 0 7px; color: var(--muted); font-size: 12.5px; }
    .chip { flex-shrink: 0; padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: 800; color: var(--green-d); background: #DDF5E8; }
    .doctor-avatar { width: 40px; height: 40px; flex-shrink: 0; display: grid; place-items: center; border-radius: 12px; color: #fff; font-weight: 800; font-size: 14px; background: linear-gradient(135deg, #16A34A, #0B7F55); }
    .performance-bar { height: 6px; overflow: hidden; border-radius: 10px; background: #E6F0EB; }
    .performance-fill { height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--green), var(--mint)); transform-origin: left; animation: growX 1.1s cubic-bezier(.2,.7,.2,1) .6s backwards; }
    .empty-state { padding: 30px 10px; text-align: center; }
    .empty-icon { width: 46px; height: 46px; margin: 0 auto 10px; display: grid; place-items: center; border-radius: 14px; color: var(--green); background: #DDF5E8; }
    .empty-state strong { display: block; font-size: 14px; color: var(--ink); }
    .empty-state span { display: block; margin-top: 5px; color: var(--muted); font-size: 13px; }

    /* ---- alerts ---- */
    .alert { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; padding: 12px 14px; border-radius: 12px; font-size: 13.5px; font-weight: 500; color: var(--ink); background: color-mix(in srgb, var(--c) 9%, #fff); }
    .alert i { width: 9px; height: 9px; flex-shrink: 0; border-radius: 50%; background: var(--c); animation: ping 2.2s infinite; }
    .kpi { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 8px; padding: 14px 16px; border: 1px solid var(--line); border-radius: 12px; }
    .kpi span { font-size: 14px; color: var(--text); font-weight: 600; }
    .kpi strong { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 18px; font-weight: 800; color: var(--green-d); }

    /* ---- calendar ---- */
    .calendar { padding: 20px; }
    .cal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
    .cal-title { font-size: 17px; font-weight: 800; }
    .cal-nav { display: flex; gap: 6px; }
    .cal-nav button { width: 30px; height: 30px; display: grid; place-items: center; border: 0; border-radius: 8px; background: transparent; color: var(--ink); font-size: 22px; line-height: 1; cursor: pointer; transition: background .2s; }
    .cal-nav button:hover { background: #E6F6EE; }
    .cal-grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 4px; text-align: center; }
    .dow { padding-bottom: 8px; color: var(--muted); font-size: 12px; font-weight: 600; }
    .day { height: 36px; display: grid; place-items: center; border-radius: 50%; font-size: 13.5px; font-weight: 500; color: var(--text); transition: background .2s; }
    .day.sun { color: var(--green-d); font-weight: 600; }
    .day:hover { background: #EAF8F0; }
    .day.today { color: #fff; font-weight: 800; background: var(--green-d); box-shadow: 0 6px 14px rgba(15,157,107,.35); animation: ping 2.4s infinite; --c: #0F9D6B; }

    /* ---- timeline ---- */
    .timeline { position: relative; display: grid; gap: 12px; padding-left: 24px; }
    .timeline::before { content: ""; position: absolute; left: 5px; top: 20px; bottom: 20px; width: 2px; border-radius: 2px; background: #BFE8D2; }
    .tl-item { position: relative; min-width: 0; }
    .tl-item::before { content: ""; position: absolute; left: -24px; top: 30px; width: 12px; height: 12px; border-radius: 50%; background: var(--green-d); }
    .tl-card { display: flex; align-items: center; gap: 12px; padding: 14px; border-radius: 16px; background: #E4F6EC; border: 1px solid #CBEBD9; transition: transform .25s; }
    .tl-card:hover { transform: translateX(3px); }
    .tl-avatar { width: 38px; height: 38px; flex-shrink: 0; display: grid; place-items: center; border-radius: 50%; background: #fff; color: var(--green-d); }
    .tl-body { flex: 1; min-width: 0; }
    .tl-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .tl-top strong { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13.5px; color: var(--ink); }
    .tl-top span { flex-shrink: 0; font-size: 12px; color: var(--muted); }
    .tl-body p { margin: 4px 0 0; font-size: 12px; color: var(--muted); }
    .tl-check { width: 24px; height: 24px; flex-shrink: 0; align-self: flex-end; display: grid; place-items: center; border-radius: 7px; color: #fff; background: var(--green-d); }
    .tl-check .ic { width: 14px; height: 14px; stroke-width: 2.6; }

    /* ---- responsive ---- */
    @media (max-width: 1350px) { .page-grid { grid-template-columns: minmax(0, 1fr) 310px; } .stats-grid { gap: 14px; } }
    @media (max-width: 1180px) { .page-grid { grid-template-columns: 1fr; } .side-col { position: static; grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 950px)  { .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .two-col { grid-template-columns: 1fr; } }
    @media (max-width: 700px)  {
      .dashboard-header { align-items: flex-start; }
      .dashboard-header h1 { font-size: 26px; }
      .header-actions { width: 100%; }
      .range-switcher { width: 100%; } .range-switcher button { flex: 1; }
      .btn-outline, .btn-solid { flex: 1; justify-content: center; }
      .stats-grid, .side-col, .two-col { grid-template-columns: 1fr; }
    }
    @media (max-width: 480px)  { .card, .stat-card { padding: 16px; } .bars { gap: 8px; } .bar-col span { font-size: 11px; } }
    @media (prefers-reduced-motion: reduce) {
      .rise, .curve, .area, .bar-track i, .performance-fill, .alert i, .day.today { animation: none !important; }
      .stat-card, .tl-card, .btn-outline, .btn-solid { transition: none; }
    }
  `]
})
export class DashboardComponent implements OnInit {

  stats: DashboardStatistics | null = null;
  loading = true;
  range: 'today' | '7d' | '30d' = 'today';

  // ---- Calendar (real month, with prev / next) ----
  calTitle = '';
  calDays: number[] = [];
  firstDow = 0;
  todayDate = 0;

  private todayY = 0;
  private todayM = 0;
  private viewY = 0;
  private viewM = 0;

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const now = new Date();
    this.todayY = this.viewY = now.getFullYear();
    this.todayM = this.viewM = now.getMonth();
    this.todayDate = now.getDate();

    this.renderCalendar();
    this.load();
  }

  get isCurrentMonth(): boolean {
    return this.viewY === this.todayY && this.viewM === this.todayM;
  }

  shiftMonth(step: number): void {
    const d = new Date(this.viewY, this.viewM + step, 1);
    this.viewY = d.getFullYear();
    this.viewM = d.getMonth();
    this.renderCalendar();
  }

  private renderCalendar(): void {
    const first = new Date(this.viewY, this.viewM, 1);
    const daysInMonth = new Date(this.viewY, this.viewM + 1, 0).getDate();

    this.calTitle = first.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    this.firstDow = first.getDay();
    this.calDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

  get noRevenue(): boolean {
    return !this.stats || !Number(this.stats.revenue);
  }

  load(): void {
    this.loading = true;

    this.dashboardService.getStatistics(this.range).subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  setRange(r: 'today' | '7d' | '30d'): void {
    this.range = r;
    this.load();
  }

  // ---- Navigation ----

  goToAppointments(): void {
    this.router.navigate(['/appointments']);
  }

  goToPatients(): void {
    this.router.navigate(['/patients']);
  }
}