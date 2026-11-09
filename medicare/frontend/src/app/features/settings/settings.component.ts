import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],

  template: `
    <div class="settings-page">

      <div class="settings-card">

        <div class="settings-header">
          <div class="settings-icon">
            <i class="bi bi-gear"></i>
          </div>

          <div>
            <h2>Settings</h2>
            <p>Manage your MediCare application data and settings.</p>
          </div>
        </div>


        <!-- DATA SECTION -->

        <div class="data-section">

          <div class="data-header">
            <div class="data-icon">
              <i class="bi bi-database"></i>
            </div>

            <div>
              <h3>Data</h3>
              <p>
                Clear all locally saved MediCare data from this browser.
                This includes patients, doctors, appointments,
                prescriptions and billing data saved in local storage.
              </p>
            </div>
          </div>


          <!-- RESET BUTTON -->

          <button
            type="button"
            class="reset-btn"
            (click)="resetAllData()"
          >
            <i class="bi bi-trash"></i>
            <span>Reset All Data</span>
          </button>

        </div>

      </div>

    </div>
  `,

 // settings.component.ts me `styles: [ ... ]` wala poora array isse replace karo
  styles: [`
    :host{display:block}
    *{box-sizing:border-box}
    .settings-page{min-height:100%;padding:0;color:#26335A;font-family:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif}

    /* MAIN CARD */
    .settings-card{width:100%;max-width:1000px;margin:0 auto;padding:26px;background:#fff;border:1px solid #E3EEE8;border-radius:20px;box-shadow:0 8px 26px -18px rgba(15,157,107,.35)}

    /* HEADER */
    .settings-header{display:flex;align-items:center;gap:16px;margin-bottom:26px}
    .settings-icon{width:48px;height:48px;flex-shrink:0;display:grid;place-items:center;border-radius:14px;color:#0F9D6B;background:#DDF5E8;border:1px solid #CBEBD9}
    .settings-icon i{font-size:22px}
    .settings-header h2{margin:0 0 5px;color:#0F1B4C;font-family:'Plus Jakarta Sans','Inter',sans-serif;font-size:24px;font-weight:800;letter-spacing:-.5px}
    .settings-header p{margin:0;color:#6B7A99;font-size:13.5px}

    /* DATA SECTION */
    .data-section{padding:22px;background:#F4FCF8;border:1px solid #E3EEE8;border-radius:16px}
    .data-header{display:flex;align-items:flex-start;gap:15px;margin-bottom:22px}
    .data-icon{width:42px;height:42px;flex-shrink:0;display:grid;place-items:center;border-radius:12px;color:#2563EB;background:#DCE9FF}
    .data-icon i{font-size:19px}
    .data-header h3{margin:0 0 6px;color:#0F1B4C;font-size:16px;font-weight:800}
    .data-header p{max-width:760px;margin:0;color:#6B7A99;font-size:13px;line-height:1.65}

    /* RESET BUTTON */
    .reset-btn{height:44px;display:inline-flex;align-items:center;justify-content:center;gap:9px;padding:0 18px;border:1px solid rgba(220,38,38,.35);border-radius:11px;color:#DC2626;background:#fff;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:background .2s ease,border-color .2s ease,color .2s ease,transform .2s ease,box-shadow .2s ease}
    .reset-btn i{font-size:15px}
    .reset-btn:hover{color:#fff;background:#DC2626;border-color:#DC2626;transform:translateY(-1px);box-shadow:0 8px 20px rgba(220,38,38,.22)}
    .reset-btn:active{transform:translateY(0)}
    .reset-btn:focus-visible{outline:3px solid rgba(220,38,38,.25);outline-offset:2px}

    /* RESPONSIVE */
    @media (max-width:700px){.settings-card{padding:20px;border-radius:16px}.data-section{padding:18px}.settings-header{align-items:flex-start}.data-header{gap:12px}.data-header p{font-size:12.5px}.reset-btn{width:100%}}
  `]
})
export class SettingsComponent {

  resetAllData(): void {

    const confirmed = confirm(
      'Are you sure you want to reset all MediCare data?\\n\\n' +
      'This will remove the data saved in this browser.'
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem('medicare_demo_data_v1');

    const keysToRemove = [
      'medicare_demo_data_v1',
      'medicare_data',
      'medicare_patients',
      'medicare_doctors',
      'medicare_appointments',
      'medicare_prescriptions',
      'medicare_bills',
      'medicare_invoices'
    ];

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });

    alert('All MediCare data has been reset.');

    window.location.reload();
  }
}