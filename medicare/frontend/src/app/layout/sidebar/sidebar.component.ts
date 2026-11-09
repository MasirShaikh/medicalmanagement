import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">

      <svg width="0" height="0" style="position:absolute" aria-hidden="true">
        <symbol id="s-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke-width="3.2"/></symbol>
        <symbol id="s-grid" viewBox="0 0 24 24"><rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/></symbol>
        <symbol id="s-doc" viewBox="0 0 24 24"><path d="M6 3v6a4 4 0 0 0 8 0V3M10 13v1.5a4.5 4.5 0 0 0 9 0V13M4.5 3H8M12 3h3.5"/><circle cx="19" cy="11" r="2"/></symbol>
        <symbol id="s-users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-5.5 6.5-5.5s6.5 1.9 6.5 5.5"/><circle cx="17.5" cy="9" r="2.5"/><path d="M17.5 14.5c2.4 0 4 1.4 4 3.8"/></symbol>
        <symbol id="s-cal" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4M9 15.5l2 2 4-4"/></symbol>
        <symbol id="s-pill" viewBox="0 0 24 24"><path d="M10.5 20.5a4.95 4.95 0 0 1-7-7l10-10a4.95 4.95 0 0 1 7 7z"/><path d="M8.5 8.5l7 7"/></symbol>
        <symbol id="s-bill" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M9 8h6M9 12h6M9 16h3"/></symbol>
        <symbol id="s-chart" viewBox="0 0 24 24"><path d="M3 3v18h18M7 15l4-5 3 3 5-7"/></symbol>
        <symbol id="s-gear" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/></symbol>
      </svg>

        
      <div class="brand">
        <div class="logo"><svg class="ic"><use href="#s-plus"/></svg></div>
        <span class="brand-name">Medi<b>Care</b></span>
      </div>

        
      <nav class="menu">
        <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="menu-item">
          <svg class="ic"><use href="#s-grid"/></svg><span>Dashboard</span>
        </a>
        <a routerLink="/doctors" routerLinkActive="active" class="menu-item">
          <svg class="ic"><use href="#s-doc"/></svg><span>Doctors</span>
        </a>
        <a routerLink="/patients" routerLinkActive="active" class="menu-item">
          <svg class="ic"><use href="#s-users"/></svg><span>Patients</span>
        </a>
        <a routerLink="/appointments" routerLinkActive="active" class="menu-item">
          <svg class="ic"><use href="#s-cal"/></svg><span>Appointments</span>
        </a>
        <a routerLink="/prescriptions" routerLinkActive="active" class="menu-item">
          <svg class="ic"><use href="#s-pill"/></svg><span>Prescriptions</span>
        </a>
        <a routerLink="/billing" routerLinkActive="active" class="menu-item">
          <svg class="ic"><use href="#s-bill"/></svg><span>Billing</span>
        </a>
        <a routerLink="/reports" routerLinkActive="active" class="menu-item">
          <svg class="ic"><use href="#s-chart"/></svg><span>Reports</span>
        </a>
        <a routerLink="/settings" routerLinkActive="active" class="menu-item">
          <svg class="ic"><use href="#s-gear"/></svg><span>Settings</span>
        </a>
      </nav>

        
      <div class="sidebar-bottom">
        <div class="status-dot"></div>
        <div>
          <div class="system-title">System Online</div>
          <div class="system-text">MediCare Clinic</div>
        </div>
      </div>

    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed; left: 0; top: 0; bottom: 0; width: 232px;
      display: flex; flex-direction: column; padding: 26px 16px 20px;
      background: linear-gradient(180deg, #E8F8EF 0%, #F3FBF7 100%);
      border-right: 1px solid #D9EEE3;
      color: #0F1B4C; z-index: 1000;
      font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
    }
    .ic { width: 22px; height: 22px; flex-shrink: 0; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }

      
    .brand { display: flex; align-items: center; gap: 12px; padding: 0 8px; margin-bottom: 30px; }
    .logo { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 11px; color: #fff; background: #16A34A; box-shadow: 0 6px 14px rgba(22,163,74,.28); }
    .logo .ic { width: 22px; height: 22px; stroke: #fff; }
    .brand-name { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; font-size: 23px; font-weight: 800; letter-spacing: -.6px; color: #0F1B4C; }
    .brand-name b { color: #0F9D6B; font-weight: 800; }

      
    .menu { display: flex; flex-direction: column; gap: 6px; flex: 1; }
    .menu-item {
      height: 46px; display: flex; align-items: center; gap: 14px; padding: 0 14px;
      border-radius: 12px; text-decoration: none; color: #4A5878; font-size: 15px; font-weight: 500;
      transition: background .2s, color .2s, transform .2s;
    }
    .menu-item .ic { color: #5B6B8C; transition: color .2s; }
    .menu-item:hover { background: rgba(22,163,74,.08); color: #0F1B4C; transform: translateX(2px); }
    .menu-item:hover .ic { color: #0F9D6B; }
    .menu-item.active { background: #D9F3E5; color: #0F9D6B; font-weight: 700; }
    .menu-item.active .ic { color: #0F9D6B; }

      
    .sidebar-bottom { display: flex; align-items: center; gap: 11px; padding: 14px; background: #fff; border: 1px solid #DCEEE5; border-radius: 14px; }
    .status-dot { width: 9px; height: 9px; flex-shrink: 0; border-radius: 50%; background: #16A34A; box-shadow: 0 0 0 3px rgba(22,163,74,.18); }
    .system-title { font-size: 12px; font-weight: 700; color: #0F1B4C; }
    .system-text { margin-top: 3px; font-size: 11px; color: #6B7A99; }

      
    @media (max-width: 1100px) { .sidebar { width: 208px; padding-left: 12px; padding-right: 12px; } }
    @media (max-width: 800px)  { .sidebar { display: none; } }
  `]
})
export class SidebarComponent {}