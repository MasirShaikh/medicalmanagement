import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],

  template: `
    <!-- icon sprite -->
    <svg width="0" height="0" style="position:absolute" aria-hidden="true">
      <defs>
        <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke-width="3.2"/></symbol>
        <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></symbol>
        <symbol id="i-doctor" viewBox="0 0 24 24"><circle cx="12" cy="7" r="3.6"/><path d="M6 13.5c-1.2 1.2-1.2 3.2 0 4.5M18 13.5c1.2 1.2 1.2 3.2 0 4.5"/><circle cx="9" cy="19.5" r="1.6"/><circle cx="15" cy="19.5" r="1.6"/></symbol>
        <symbol id="i-users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-5.5 6.5-5.5s6.5 1.9 6.5 5.5"/><circle cx="17.5" cy="9" r="2.5"/><path d="M17.5 14.5c2.4 0 4 1.4 4 3.8"/></symbol>
        <symbol id="i-lock" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 15v2"/></symbol>
        <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
        <symbol id="i-login" viewBox="0 0 24 24"><path d="M10 17l5-5-5-5M15 12H3M15 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/></symbol>
        <symbol id="i-cal" viewBox="0 0 24 24"><path d="M19 11V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h6M7 3v4M15 3v4M3 10h16"/><circle cx="17.5" cy="17.5" r="4"/><path d="M17.5 15.5v2l1.3 1"/></symbol>
        <symbol id="i-doc" viewBox="0 0 24 24"><path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M14 3v5h5M8 13h8M8 17h5"/></symbol>
        <symbol id="i-bill" viewBox="0 0 24 24"><path d="M12 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8l4 4v5"/><path d="M8 12h4M8 8h3"/><circle cx="17" cy="17" r="4"/><path d="M17 15v2l1.4 1"/></symbol>
        <symbol id="i-flask" viewBox="0 0 24 24"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3M7.5 15h9"/></symbol>
        <symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 20s-8-4.8-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6.2-8 11-8 11z" fill="currentColor" stroke="none"/><path d="M7 12h2.5l1.5-3 2 5 1.5-2H17" stroke="#fff" stroke-width="1.6"/></symbol>
      </defs>
    </svg>

    <main class="login-page">

      <!-- LEFT: brand -->
      <section class="lg-brand" aria-hidden="true">

        <div class="lg-logo">
          <span class="lg-mark"><svg class="ic"><use href="#i-plus"/></svg></span>
          Medi<span class="lg-care">Care</span>
        </div>

        <div class="lg-hero">
          <h1>Every patient,<br />every appointment,<br /><em>one calm screen.</em></h1>
          <p>Patients, doctors, prescriptions and billing,<br />managed from a single place.</p>

          <div class="lg-ecg">
            <svg viewBox="0 0 520 110">
              <path class="ghost" pathLength="100" d="M0 55 H110 L122 47 L134 55 H150 L162 3 L178 85 L192 55 H300 L312 13 L330 77 L345 47 L355 55 H520" />
              <path class="live" pathLength="100" d="M0 55 H110 L122 47 L134 55 H150 L162 3 L178 85 L192 55 H300 L312 13 L330 77 L345 47 L355 55 H520" />
            </svg>
            <span class="lg-heart">
              <svg class="ic fx f1"><use href="#i-heart"/></svg>
              <svg class="ic fx f2"><use href="#i-cal"/></svg>
              <svg class="ic fx f3"><use href="#i-doc"/></svg>
              <svg class="ic fx f4"><use href="#i-bill"/></svg>
            </span>
          </div>

          <div class="lg-chips">
            <div class="lg-chip">
              <span class="lg-tile t-green"><svg class="ic"><use href="#i-cal"/></svg></span>
              <div><b>Appointments</b><span>Book and reschedule in seconds</span></div>
              <svg class="ic lg-go"><use href="#i-arrow"/></svg>
            </div>
            <div class="lg-chip">
              <span class="lg-tile t-blue"><svg class="ic"><use href="#i-doc"/></svg></span>
              <div><b>Records</b><span>Secure, searchable history</span></div>
              <svg class="ic lg-go"><use href="#i-arrow"/></svg>
            </div>
            <div class="lg-chip">
              <span class="lg-tile t-orange"><svg class="ic"><use href="#i-bill"/></svg></span>
              <div><b>Billing</b><span>Invoices and payments tracked</span></div>
              <svg class="ic lg-go"><use href="#i-arrow"/></svg>
            </div>
          </div>
        </div>

        <small class="lg-foot">© 2026 MediCare Clinic Management System</small>
      </section>

      <section class="lg-panel">
        <div class="lg-card">
          <div class="lg-inner">

            <div class="lg-logo lg-mobile">
              <span class="lg-mark"><svg class="ic"><use href="#i-plus"/></svg></span>
              Medi<span class="lg-care">Care</span>
            </div>

            <header class="lg-head">
              <h2>Welcome back</h2>
              <p>Sign in to open your clinic dashboard.</p>
            </header>

            <form (ngSubmit)="onSubmit()" novalidate>

              <span class="lg-label">Sign in as</span>
              <div class="role-tabs">
                <button type="button" [class.active]="role === 'Admin'" (click)="role = 'Admin'">
                  <svg class="ic"><use href="#i-user"/></svg>Admin
                </button>
                <button type="button" [class.active]="role === 'Doctor'" (click)="role = 'Doctor'">
                  <svg class="ic"><use href="#i-doctor"/></svg>Doctor
                </button>
                <button type="button" [class.active]="role === 'Receptionist'" (click)="role = 'Receptionist'">
                  <svg class="ic"><use href="#i-user"/></svg>Receptionist
                </button>
                <button type="button" [class.active]="role === 'Patient'" (click)="role = 'Patient'">
                  <svg class="ic"><use href="#i-users"/></svg>Patient
                </button>
              </div>

              <div class="login-error" *ngIf="error" role="alert">{{ error }}</div>

              <div class="lg-field">
                <label class="lg-label" for="username">Username</label>
                <div class="lg-control">
                  <svg class="ic lg-ico"><use href="#i-user"/></svg>
                  <input id="username" name="username" type="text" [(ngModel)]="username"
                    placeholder="Enter your username" autocomplete="username" required />
                </div>
              </div>

              <div class="lg-field">
                <label class="lg-label" for="password">Password</label>
                <div class="lg-control">
                  <svg class="ic lg-ico"><use href="#i-lock"/></svg>
                  <input id="password" name="password" [type]="showPassword ? 'text' : 'password'"
                    [(ngModel)]="password" placeholder="Enter your password"
                    autocomplete="current-password" required />
                  <button type="button" class="lg-toggle" (click)="showPassword = !showPassword"
                    [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'">
                    {{ showPassword ? 'Hide' : 'Show' }}
                  </button>
                </div>
              </div>

              <button class="login-btn" type="submit" [disabled]="loading">
                <ng-container *ngIf="!loading">
                  <svg class="ic"><use href="#i-login"/></svg>Sign in
                </ng-container>
                <span class="loading" *ngIf="loading"><i class="spinner"></i>Signing in…</span>
              </button>

            </form>

            <div class="demo-box">
              <span class="demo-ico"><svg class="ic"><use href="#i-flask"/></svg></span>
              <div>
                <b>Demo login (any role)</b>
                <div class="demo-row">
                  Username <code>admin</code> Password <code>admin123</code>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  `,

  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@700;800&display=swap');

    :host{
      --g:#0F9D6B;--gd:#0B7F55;--navy:#0F1B4C;--muted:#5B6785;
      --border:#E1E7F5;--error:#DC2626;
      display:block;
    }
    *{box-sizing:border-box;}
    .ic{width:20px;height:20px;flex:none;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;}

    .login-page{min-height:100vh;display:flex;color:var(--navy);
      font-family:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased;
      background:linear-gradient(135deg,#F5FDF9,#D8F6E7);}
    .lg-hero h1,.lg-head h2,.lg-logo{font-family:'Plus Jakarta Sans','Inter',sans-serif;}

    /* ---------- LEFT ---------- */
    .lg-brand{width:52%;min-height:100vh;padding:44px 64px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;
      background:
        radial-gradient(620px 520px at 105% 38%,rgba(110,231,183,.38),transparent 65%),
        radial-gradient(520px 420px at -5% 105%,rgba(110,231,183,.32),transparent 60%);}
    .lg-logo{display:flex;align-items:center;gap:12px;font-weight:800;font-size:28px;letter-spacing:-.8px;color:var(--navy);}
    .lg-care{color:var(--g);margin-left:-9px;}
    .lg-mark{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;background:var(--g);color:#fff;box-shadow:0 8px 18px rgba(15,157,107,.28);}
    .lg-mark .ic{width:28px;height:28px;stroke:#fff;}
    .lg-hero{max-width:560px;}
    .lg-hero h1{margin:0 0 20px;font-size:clamp(34px,3.8vw,52px);line-height:1.12;font-weight:800;letter-spacing:-1.6px;color:var(--navy);}
    .lg-hero h1 em{font-style:normal;color:var(--g);}
    .lg-hero p{margin:0;font-size:17px;line-height:1.7;color:#3A4668;}

    .lg-ecg{--t:3.6s;position:relative;margin:34px 0 26px;}
    .lg-ecg svg{display:block;width:calc(100% - 60px);height:auto;overflow:visible;}
    .lg-ecg path{fill:none;stroke-linecap:round;stroke-linejoin:round;}
    .lg-ecg .ghost{stroke:#9EE4C6;stroke-width:2.5;}
    .lg-ecg .live{stroke:#2EC98B;stroke-width:4.5;stroke-dasharray:14 200;stroke-dashoffset:14;filter:drop-shadow(0 0 6px rgba(46,201,139,.55));animation:lgBeat var(--t) linear infinite;}
    /* head of the line reaches the circle at 88% of each cycle */
    @keyframes lgBeat{0%{stroke-dashoffset:14;}88%{stroke-dashoffset:-86;}100%{stroke-dashoffset:-100;}}

    /* circle: ekdum steady (na scale, na expanding ring). Sirf andar ke icons badalte hain. */
    .lg-heart{position:absolute;right:0;top:50%;transform:translateY(-50%);width:64px;height:64px;border-radius:50%;background:#fff;color:#2FBF8A;box-shadow:0 0 0 10px rgba(110,231,183,.32),0 8px 20px rgba(15,157,107,.18);}

    /* one icon per line-arrival; whole loop = 4 cycles, icon swaps exactly when the line hits the circle */
    .lg-heart .fx{position:absolute;left:50%;top:50%;width:34px;height:34px;margin:-17px 0 0 -17px;opacity:0;transform:scale(.6) rotate(-15deg);animation:lgSwap calc(var(--t) * 4) cubic-bezier(.4,0,.2,1) infinite;}
    .lg-heart .f1{animation-delay:calc(var(--t) * -.12);}
    .lg-heart .f2{animation-delay:calc(var(--t) * .88);}
    .lg-heart .f3{animation-delay:calc(var(--t) * 1.88);}
    .lg-heart .f4{animation-delay:calc(var(--t) * 2.88);}
    @keyframes lgSwap{
      0%{opacity:0;transform:scale(.6) rotate(-15deg);}
      4%,25%{opacity:1;transform:scale(1) rotate(0);}
      29%,100%{opacity:0;transform:scale(.6) rotate(15deg);}
    }

    .lg-chips{display:grid;gap:12px;}
    .lg-chip{display:flex;align-items:center;gap:18px;padding:16px 22px 16px 16px;background:rgba(255,255,255,.78);border:1px solid #D3EEE0;border-radius:18px;box-shadow:0 4px 14px rgba(15,157,107,.06);}
    .lg-chip div{flex:1;display:flex;flex-direction:column;gap:3px;}
    .lg-chip b{font-size:17px;font-weight:700;color:var(--navy);}
    .lg-chip div span{font-size:15px;color:#3A4668;}
    .lg-tile{width:54px;height:54px;border-radius:16px;display:grid;place-items:center;}
    .lg-tile .ic{width:28px;height:28px;}
    .t-green{background:#D3F5E3;color:var(--g);}
    .t-blue{background:#DCE6FF;color:#3558D6;}
    .t-orange{background:#FFE5BF;color:#EA8508;}
    .lg-go{color:var(--g);width:22px;height:22px;}
    .lg-foot{font-size:14px;color:#4A5778;margin-top:10px;margin-left:6px;}

    /* ---------- RIGHT ---------- */
    .lg-panel{flex:1;display:flex;padding:10px 10px 10px 0;}
    .lg-card{flex:1;display:grid;place-items:center;padding:40px 48px;background:#fff;border-radius:30px;box-shadow:0 10px 40px rgba(15,157,107,.10);}
    .lg-inner{width:100%;max-width:520px;}
    .lg-mobile{display:none;margin-bottom:28px;}
    .lg-head{margin-bottom:28px;}
    .lg-head h2{margin:0 0 8px;font-size:40px;font-weight:800;letter-spacing:-1.4px;color:#0A1240;}
    .lg-head p{margin:0;font-size:17px;color:var(--muted);}
    .lg-label{display:block;margin-bottom:10px;font-size:16px;font-weight:700;color:#0A1240;}

    .role-tabs{display:flex;padding:5px;margin-bottom:26px;background:#fff;border:1.5px solid var(--border);border-radius:999px;}
    .role-tabs button{flex:1;display:flex;align-items:center;justify-content:center;gap:7px;padding:11px 6px;border:0;border-radius:999px;background:transparent;font:inherit;font-size:13.5px;font-weight:500;color:#34406A;cursor:pointer;white-space:nowrap;transition:background .15s,color .15s;}
    .role-tabs button .ic{width:20px;height:20px;}
    .role-tabs button:not(.active)+button:not(.active){border-radius:0;box-shadow:inset 1px 0 0 var(--border);}
    .role-tabs button:hover:not(.active){color:var(--g);}
    .role-tabs button.active{background:var(--g);color:#fff;font-weight:700;box-shadow:0 6px 14px rgba(15,157,107,.28);}

    .lg-field{margin-bottom:22px;}
    .lg-control{position:relative;display:flex;align-items:center;}
    .lg-ico{position:absolute;left:18px;color:#5B6785;pointer-events:none;}
    .lg-control input{width:100%;height:58px;padding:0 74px 0 54px;font:inherit;font-size:16px;color:#0A1240;background:#F2F5FF;border:1.5px solid #D5DDF3;border-radius:16px;transition:border-color .15s,box-shadow .15s;}
    .lg-control input::placeholder{color:#8591AE;}
    .lg-control input:focus{outline:none;border-color:var(--g);box-shadow:0 0 0 4px rgba(15,157,107,.14);}
    .lg-toggle{position:absolute;right:10px;height:38px;padding:0 12px;border:0;border-radius:8px;background:transparent;color:var(--g);font:inherit;font-size:14px;font-weight:700;cursor:pointer;}
    .lg-toggle:hover{background:rgba(15,157,107,.08);}

    .login-error{display:flex;align-items:center;gap:10px;margin-bottom:18px;padding:12px 14px;font-size:13px;color:var(--error);background:rgba(220,38,38,.07);border:1px solid rgba(220,38,38,.25);border-radius:12px;}
    .login-error::before{content:"!";width:20px;height:20px;flex:none;display:grid;place-items:center;border-radius:50%;background:var(--error);color:#fff;font-size:12px;font-weight:800;}

    .login-btn{width:100%;height:58px;display:flex;align-items:center;justify-content:center;gap:14px;border:0;border-radius:16px;font:inherit;font-size:19px;font-weight:700;color:#fff;cursor:pointer;background:linear-gradient(135deg,#10A56F,#0B8F5F);box-shadow:0 10px 24px rgba(15,157,107,.30);transition:transform .15s,box-shadow .15s;}
    .login-btn .ic{width:24px;height:24px;}
    .login-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 14px 30px rgba(15,157,107,.36);}
    .login-btn:active{transform:scale(.99);}
    .login-btn:disabled{opacity:.7;cursor:not-allowed;}
    .loading{display:inline-flex;align-items:center;gap:10px;}
    .spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;}
    @keyframes spin{to{transform:rotate(360deg);}}
    .login-btn:focus-visible,.lg-toggle:focus-visible,.role-tabs button:focus-visible{outline:3px solid rgba(15,157,107,.4);outline-offset:2px;}

    .demo-box{display:flex;align-items:center;gap:16px;margin-top:24px;padding:18px 20px;background:#EDFAF3;border:1px solid #CDEFDD;border-radius:16px;font-size:15px;color:#34406A;}
    .demo-ico{width:48px;height:48px;flex:none;border-radius:50%;display:grid;place-items:center;background:#D3F3E3;color:var(--g);}
    .demo-ico .ic{width:24px;height:24px;}
    .demo-box b{display:block;margin-bottom:6px;font-size:16px;color:#0A1240;}
    .demo-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px 10px;}
    .demo-box code{padding:5px 14px;font-family:ui-monospace,Consolas,monospace;font-size:14px;color:var(--gd);background:#D3F3E3;border-radius:999px;}

    @media (max-width:900px){
      .lg-brand{display:none;}
      .lg-mobile{display:flex;}
      .lg-panel{padding:0;}
      .lg-card{border-radius:0;box-shadow:none;padding:32px 22px;}
    }
    @media (max-width:520px){
      .role-tabs button .ic{display:none;}
      .role-tabs button{font-size:12px;}
      .lg-head h2{font-size:32px;}
    }
    @media (prefers-reduced-motion:reduce){
      .spinner{animation-duration:1.6s;}
      .lg-ecg .live{animation:none;stroke-dasharray:none;filter:none;}
      .lg-heart .fx{animation:none;}
      .lg-heart .f1{opacity:1;transform:none;}
      .login-btn{transition:none;}
    }
  `]
})
export class LoginComponent {

  username = '';
  password = '';

  // Role tabs (UI only). login() below is unchanged: it still sends username + password.
  role = 'Admin';

  loading = false;
  error = '';

  showPassword = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.error = '';

    if (!this.username.trim() || !this.password.trim()) {
      this.error = 'Enter your username and password to continue.';
      return;
    }

    this.loading = true;

    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.error = 'Wrong username or password. Check both and try again.';
      }
    });
  }
}