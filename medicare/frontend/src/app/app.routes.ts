import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { ShellComponent } from './layout/shell/shell.component';

import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

import { PatientListComponent } from './features/patients/patient-list/patient-list.component';
import { AppointmentListComponent } from './features/appointments/appointment-list/appointment-list.component';

import { DoctorListComponent } from './features/doctors/doctor-list/doctor-list.component';
import { PrescriptionListComponent } from './features/prescriptions/prescription-list.component';
import { BillingListComponent } from './features/billing/billing-list.component';
import { ReportsComponent } from './features/reports/reports.component';
import { SettingsComponent } from './features/settings/settings.component';

export const routes: Routes = [

  // Login
  {
    path: 'login',
    component: LoginComponent
  },

  // Main Application
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],

    children: [

      // Default route
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      // Dashboard
      {
        path: 'dashboard',
        component: DashboardComponent
      },

      // Patients
      {
        path: 'patients',
        component: PatientListComponent
      },

      // Appointments
      {
        path: 'appointments',
        component: AppointmentListComponent
      },

      // Doctors
      {
        path: 'doctors',
        component: DoctorListComponent
      },

      // Prescriptions
      {
        path: 'prescriptions',
        component: PrescriptionListComponent
      },

      // Billing
      {
        path: 'billing',
        component: BillingListComponent
      },

      // Reports
      {
        path: 'reports',
        component: ReportsComponent
      },

      // Settings
      {
        path: 'settings',
        component: SettingsComponent
      }
    ]
  },

  // Invalid URL
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];