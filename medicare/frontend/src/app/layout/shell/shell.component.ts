import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="shell">

        
      <app-sidebar></app-sidebar>

      <div class="main-area">
        <app-topbar></app-topbar>

        <main class="page-content">
          <router-outlet></router-outlet>
        </main>
      </div>

    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }
    :host { display: block; }

    .shell {
      min-height: 100vh;
      width: 100%;
      color: #0F1B4C;
      overflow-x: hidden;
      background:
        radial-gradient(900px 500px at 100% 0%, rgba(110,231,183,.18), transparent 60%),
        linear-gradient(180deg, #F6FCF9, #EEF9F3);
    }

      
    .main-area {
      min-height: 100vh;
      margin-left: 232px;
      width: calc(100% - 232px);
      padding-top: 72px;            
    }

    .page-content { padding: 22px 28px 36px; }

    @media (max-width: 1100px) {
      .main-area { margin-left: 208px; width: calc(100% - 208px); }
      .page-content { padding: 18px; }
    }
    @media (max-width: 800px) {
      .main-area { margin-left: 0; width: 100%; }
      .page-content { padding: 16px 12px 28px; }
    }
  `]
})
export class ShellComponent {}