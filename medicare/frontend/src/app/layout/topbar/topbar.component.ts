import { Component, ElementRef, HostListener, OnDestroy, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { AppNotification, NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  template: `
    <header class="topbar">

      <svg width="0" height="0" style="position:absolute" aria-hidden="true">
        <symbol id="t-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></symbol>
        <symbol id="t-bell" viewBox="0 0 24 24"><path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 21h4"/></symbol>
        <symbol id="t-logout" viewBox="0 0 24 24"><path d="M10 17l-5-5 5-5M5 12h11M16 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/></symbol>
        <symbol id="t-patient" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M19 8v6M16 11h6"/></symbol>
        <symbol id="t-doctor" viewBox="0 0 24 24"><path d="M5 3v5a4 4 0 0 0 8 0V3"/><path d="M9 12v3a5 5 0 0 0 10 0v-1"/><circle cx="19" cy="12" r="2"/></symbol>
        <symbol id="t-appointment" viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/></symbol>
        <symbol id="t-prescription" viewBox="0 0 24 24"><rect x="2.5" y="8.5" width="19" height="7" rx="3.5" transform="rotate(-45 12 12)"/><path d="M9.2 9.2l5.6 5.6"/></symbol>
        <symbol id="t-billing" viewBox="0 0 24 24"><path d="M6 5h12M6 9h12M9 5c4.5 0 6 2 6 4s-1.5 4-6 4H8l7 6"/></symbol>
        <symbol id="t-record" viewBox="0 0 24 24"><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/></symbol>
        <symbol id="t-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></symbol>
        <symbol id="t-check" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></symbol>
      </svg>

        
      <div class="search-box">
        <svg class="ic"><use href="#t-search"/></svg>
        <input type="search" placeholder="Search patients, doctors..." />
      </div>

        
      <div class="top-right">

          
        <div class="notif-wrap">
          <button class="notification" [class.open]="open()" (click)="toggle()"
                  aria-label="Notifications" [attr.aria-expanded]="open()">
            <svg class="ic"><use href="#t-bell"/></svg>
            @if (notif.unreadCount() > 0) { <span class="notification-dot"></span> }
          </button>

          @if (open()) {
            <div class="np" role="dialog" aria-label="Notifications">
              <div class="np-head">
                <div>
                  <h4>Notifications</h4>
                  <p>
                    @if (fresh().size > 0) { {{ fresh().size }} new · }
                    {{ notif.items().length }} total
                  </p>
                </div>
                <button class="np-clear" (click)="notif.clear()" [disabled]="!notif.items().length">Clear all</button>
              </div>

              <div class="np-list">
                @for (n of notif.items(); track n.id) {
                  <div class="np-item" [class.is-new]="fresh().has(n.id)">
                    <div class="np-ico" [class]="'np-ico tone-' + n.tone">
                      <svg class="ic"><use [attr.href]="'#t-' + n.kind"/></svg>
                    </div>
                    <div class="np-body">
                      <div class="np-title">{{ n.title }}</div>
                      <div class="np-msg">{{ n.message }}</div>
                      <div class="np-time">{{ ago(n) }}</div>
                    </div>
                    <button class="np-x" (click)="notif.remove(n.id)" aria-label="Dismiss">
                      <svg class="ic"><use href="#t-x"/></svg>
                    </button>
                  </div>
                } @empty {
                  <div class="np-empty">
                    <div class="np-empty-ico"><svg class="ic"><use href="#t-bell"/></svg></div>
                    <strong>You're all caught up</strong>
                    <span>New patients, doctors and appointment updates will show up here.</span>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <div class="user-box">
          <div class="avatar">{{ initials() }}</div>
          <div class="user-info">
            <strong>{{ auth.currentUser()?.username || 'Guest' }}</strong>
            <span>Admin</span>
          </div>
        </div>

        <span class="divider"></span>

        <button class="logout-btn" (click)="auth.logout()">
          <svg class="ic"><use href="#t-logout"/></svg>Logout
        </button>

      </div>
    </header>
  `,
  styles: [`
    .topbar {
      position: fixed; top: 0; left: 232px; right: 0; height: 72px;
      display: flex; align-items: center; justify-content: space-between; padding: 0 28px;
      background: rgba(255,255,255,.88); backdrop-filter: blur(10px);
      border-bottom: 1px solid #E2EEE8; z-index: 900;
      font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
    }
    .ic { width: 20px; height: 20px; flex-shrink: 0; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }

      
    .search-box { width: 420px; max-width: 100%; height: 42px; display: flex; align-items: center; gap: 11px; padding: 0 15px; background: #F5F8FB; border: 1px solid #DCE5EE; border-radius: 12px; color: #6B7A99; transition: border-color .2s, box-shadow .2s; }
    .search-box input { width: 100%; border: 0; outline: 0; background: transparent; color: #0F1B4C; font: inherit; font-size: 14px; }
    .search-box input::placeholder { color: #8591AE; }
    .search-box:focus-within { border-color: #16A34A; box-shadow: 0 0 0 3px rgba(22,163,74,.12); background: #fff; }

      
    .top-right { display: flex; align-items: center; gap: 18px; }
    .notif-wrap { position: relative; }
    .notification { position: relative; width: 38px; height: 38px; display: grid; place-items: center; border: 0; background: transparent; color: #4A5878; cursor: pointer; border-radius: 10px; transition: color .2s, background .2s; }
    .notification .ic { width: 22px; height: 22px; }
    .notification:hover, .notification.open { color: #0F9D6B; background: #EEF8F2; }
    .notification-dot { position: absolute; top: 7px; right: 8px; width: 8px; height: 8px; border-radius: 50%; background: #16A34A; border: 2px solid #fff; animation: dotPulse 2s ease-out infinite; }
    @keyframes dotPulse { 0% { box-shadow: 0 0 0 0 rgba(22,163,74,.5); } 70%, 100% { box-shadow: 0 0 0 7px rgba(22,163,74,0); } }

    .np { position: absolute; top: calc(100% + 22px); right: -70px; width: 380px; max-width: calc(100vw - 24px); background: #fff; border: 1px solid #E3EEE8; border-radius: 18px; box-shadow: 0 24px 60px -12px rgba(15,27,76,.28), 0 8px 24px -16px rgba(15,157,107,.35); overflow: hidden; animation: npIn .18s ease-out; transform-origin: top right; z-index: 5; }
    @keyframes npIn { from { opacity: 0; transform: translateY(-6px) scale(.98); } to { opacity: 1; transform: none; } }
    .np-head { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px 12px; border-bottom: 1px solid #E3EEE8; }
    .np-head h4 { margin: 0; font-family: 'Plus Jakarta Sans','Inter',sans-serif; font-size: 17px; font-weight: 800; color: #0F1B4C; letter-spacing: -.3px; }
    .np-head p { margin: 3px 0 0; font-size: 12px; color: #6B7A99; }
    .np-clear { border: 0; background: transparent; color: #0F9D6B; font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; padding: 6px 10px; border-radius: 8px; }
    .np-clear:hover:not(:disabled) { background: #E6F6EE; }
    .np-clear:disabled { color: #A6B1C8; cursor: default; }

    .np-list { max-height: 420px; overflow-y: auto; padding: 8px; }
    .np-list::-webkit-scrollbar { width: 6px; }
    .np-list::-webkit-scrollbar-thumb { background: #D5E3DB; border-radius: 6px; }

    .np-item { position: relative; display: flex; gap: 12px; align-items: flex-start; padding: 12px; border-radius: 13px; transition: background .15s; }
    .np-item:hover { background: #F1FAF5; }
    .np-item.is-new { background: #F1FAF5; }
    .np-item.is-new::before { content: ''; position: absolute; left: 3px; top: 50%; width: 5px; height: 5px; margin-top: -2.5px; border-radius: 50%; background: #16A34A; }

    .np-ico { width: 40px; height: 40px; flex-shrink: 0; display: grid; place-items: center; border-radius: 12px; }
    .tone-success { color: #16A34A; background: #E6F6EE; }
    .tone-info    { color: #2563EB; background: #E8F0FE; }
    .tone-danger  { color: #DC2626; background: #FDECEC; }
    .tone-warning { color: #D97706; background: #FEF3E2; }

    .np-body { flex: 1; min-width: 0; }
    .np-title { font-size: 14px; font-weight: 700; color: #0F1B4C; }
    .np-msg { margin-top: 2px; font-size: 13px; line-height: 1.4; color: #4A5878; word-break: break-word; }
    .np-time { margin-top: 5px; font-size: 11.5px; color: #8591AE; font-weight: 500; }

    .np-x { width: 26px; height: 26px; display: grid; place-items: center; border: 0; background: transparent; color: #A6B1C8; border-radius: 8px; cursor: pointer; opacity: 0; transition: opacity .15s, background .15s, color .15s; }
    .np-x .ic { width: 14px; height: 14px; }
    .np-item:hover .np-x { opacity: 1; }
    .np-x:hover { background: #FDECEC; color: #DC2626; }

    .np-empty { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 38px 28px 40px; text-align: center; }
    .np-empty-ico { width: 54px; height: 54px; display: grid; place-items: center; border-radius: 16px; background: #E6F6EE; color: #16A34A; margin-bottom: 6px; }
    .np-empty-ico .ic { width: 26px; height: 26px; }
    .np-empty strong { font-size: 15px; color: #0F1B4C; }
    .np-empty span { font-size: 13px; color: #6B7A99; line-height: 1.45; }

    .user-box { display: flex; align-items: center; gap: 10px; }
    .avatar { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 50%; background: #16A34A; color: #fff; font-size: 15px; font-weight: 800; box-shadow: 0 4px 12px rgba(22,163,74,.28); }
    .user-info { display: flex; flex-direction: column; gap: 2px; }
    .user-info strong { color: #0F1B4C; font-size: 14px; font-weight: 700; }
    .user-info span { color: #7A88A6; font-size: 11px; }

    .divider { width: 1px; height: 30px; background: #DCE5EE; }

    .logout-btn { height: 40px; display: inline-flex; align-items: center; gap: 8px; padding: 0 16px; border-radius: 10px; background: #fff; border: 1px solid #DCE5EE; color: #0F1B4C; font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; transition: all .2s; }
    .logout-btn:hover { border-color: #16A34A; color: #0F9D6B; background: #F0FAF4; }

      
    @media (max-width: 1100px) { .topbar { left: 208px; padding: 0 18px; } .search-box { width: 300px; } }
    @media (max-width: 800px)  { .topbar { left: 0; } }
    @media (max-width: 650px)  {
      .search-box { width: 180px; }
      .user-info, .divider { display: none; }
      .notif-wrap { position: static; }
      .np { position: fixed; top: 80px; left: 12px; right: 12px; width: auto; max-width: none; }
    }
  `]
})
export class TopbarComponent implements OnDestroy {

  open = signal(false);
    
  fresh = signal<Set<string>>(new Set());
  private now = signal(Date.now());
  private timer = setInterval(() => this.now.set(Date.now()), 30_000);

  constructor(public auth: AuthService, public notif: NotificationService, private host: ElementRef<HTMLElement>) {
    this.notif.sync();
  }

  ngOnDestroy(): void { clearInterval(this.timer); }

  initials(): string {
    const u = this.auth.currentUser();
    if (!u) { return '?'; }
    return `${u.first_name?.[0] ?? u.username[0]}`.toUpperCase();
  }

  toggle(): void {
    if (this.open()) { this.close(); return; }
    // kholte hi: naye wale yaad rakho, phir sab "read" mark karo -> green dot gayab
    this.fresh.set(new Set(this.notif.items().filter(n => !n.read).map(n => n.id)));
    this.notif.markAllRead();
    this.now.set(Date.now());
    this.open.set(true);
  }

  private close(): void {
    this.open.set(false);
    this.fresh.set(new Set());
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    if (!this.open()) { return; }
    const wrap = this.host.nativeElement.querySelector('.notif-wrap');
    if (wrap && !wrap.contains(e.target as Node)) { this.close(); }
  }

  @HostListener('document:keydown.escape')
  onEsc(): void { if (this.open()) { this.close(); } }

    
  ago(n: AppNotification): string {
    const s = Math.max(0, Math.floor((this.now() - n.time) / 1000));
    if (s < 45) { return 'Just now'; }
    const m = Math.round(s / 60);
    if (m < 60) { return `${m} min ago`; }
    const h = Math.round(m / 60);
    if (h < 24) { return `${h} hr ago`; }
    const d = Math.round(h / 24);
    if (d === 1) { return 'Yesterday'; }
    return new Date(n.time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }
}