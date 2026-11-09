import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NotificationService, AppNotification } from '../services/notification.service';

type Draft = Pick<AppNotification, 'kind' | 'tone' | 'title' | 'message'>;

/**
 * Jab bhi koi save / update / delete API successfully ho jaye (patient, doctor, appointment,
 * prescription, billing...), yeh interceptor khud ek notification bana deta hai.
 * Isliye kisi component mein alag se code likhne ki zaroorat nahi.
 */
export const notificationInterceptor: HttpInterceptorFn = (req, next) => {
  const notif = inject(NotificationService);

  return next(req).pipe(
    tap(event => {
      if (!(event instanceof HttpResponse) || event.status < 200 || event.status >= 300) { return; }
      if (!req.url.startsWith(environment.apiUrl)) { return; }

      const parts = req.url.slice(environment.apiUrl.length).split('?')[0].split('/').filter(Boolean);
      const [resource, ...rest] = parts;
      if (!resource || resource === 'auth' || resource === 'reports') { return; }

      const id = rest.find(s => /^\d+$/.test(s));
      const body: any = event.body;

      // naam yaad rakho (GET / POST / PUT ke response se) taaki delete par bhi naam dikhe
      rememberLabels(notif, resource, body);

      if (req.method === 'GET') { return; }

      const draft = describe(notif, resource, rest[0], req.method, body, id);
      if (draft) { notif.add(draft); }
    })
  );
};

function rememberLabels(notif: NotificationService, resource: string, body: any): void {
  if (!body || typeof body !== 'object') { return; }
  const rows: any[] = Array.isArray(body.results) ? body.results : ('id' in body ? [body] : []);
  for (const r of rows) {
    const label = r.full_name ?? r.name ?? r.patient_name;
    if (r.id != null && label) { notif.remember(resource, r.id, label); }
  }
}

function describe(
  notif: NotificationService, resource: string, sub: string | undefined,
  method: string, b: any, id?: string
): Draft | null {
  const isDelete = method === 'DELETE';
  const isCreate = method === 'POST';
  const money = (v: any) => `₹${Number(v ?? 0).toLocaleString('en-IN')}`;

  switch (resource) {

    case 'patients': {
      const name = b?.full_name ?? notif.label('patients', id) ?? 'A patient';
      if (isCreate)  { return { kind: 'patient', tone: 'success', title: 'New patient registered', message: `${name} has been added to the clinic records.` }; }
      if (isDelete)  { return { kind: 'patient', tone: 'danger',  title: 'Patient removed',        message: `${name} was deleted from the records.` }; }
      return           { kind: 'patient', tone: 'info',    title: 'Patient details updated', message: `${name}'s record was updated.` };
    }

    case 'doctors': {
      if (sub === 'departments') { return null; }
      const name = b?.name ?? notif.label('doctors', id) ?? 'A doctor';
      const spec = b?.specialization ? ` · ${b.specialization}` : '';
      if (isCreate)  { return { kind: 'doctor', tone: 'success', title: 'New doctor added',    message: `${name}${spec} joined the clinic.` }; }
      if (isDelete)  { return { kind: 'doctor', tone: 'danger',  title: 'Doctor removed',      message: `${name} was removed from the clinic.` }; }
      return           { kind: 'doctor', tone: 'info',    title: 'Doctor details updated', message: `${name}'s profile was updated.` };
    }

    case 'appointments': {
      const patient = b?.patient_name ?? notif.label('appointments', id) ?? 'A patient';
      const doctor  = b?.doctor_name ?? 'the doctor';
      if (isCreate) {
        return { kind: 'appointment', tone: 'success', title: 'Appointment booked',
                 message: `${patient} with ${doctor} on ${b?.date ?? ''} at ${b?.time ?? ''}.`.replace(/\s+\./, '.') };
      }
      if (isDelete) { return { kind: 'appointment', tone: 'danger', title: 'Appointment deleted', message: `${patient}'s appointment was deleted.` }; }
      switch (b?.status) {
        case 'completed': return { kind: 'appointment', tone: 'info',    title: 'Appointment completed', message: `${patient}'s visit with ${doctor} is marked as completed.` };
        case 'cancelled': return { kind: 'appointment', tone: 'danger',  title: 'Appointment cancelled', message: `${patient}'s appointment with ${doctor} was cancelled.` };
        case 'no_show':   return { kind: 'appointment', tone: 'warning', title: 'Patient did not show up', message: `${patient} missed the appointment with ${doctor}.` };
        default:          return { kind: 'appointment', tone: 'info',    title: 'Appointment updated',   message: `${patient}'s appointment with ${doctor} was updated.` };
      }
    }

    case 'prescriptions': {
      const patient = b?.patient_name ?? notif.label('prescriptions', id) ?? 'a patient';
      const by = b?.doctor_name ? ` by ${b.doctor_name}` : '';
      if (isCreate) { return { kind: 'prescription', tone: 'success', title: 'Prescription issued',  message: `New prescription for ${patient}${by}.` }; }
      if (isDelete) { return { kind: 'prescription', tone: 'danger',  title: 'Prescription deleted', message: `A prescription for ${patient} was deleted.` }; }
      return          { kind: 'prescription', tone: 'info',    title: 'Prescription updated', message: `Prescription for ${patient} was updated.` };
    }

    case 'billing': {
      if (sub === 'payments') {
        if (!isCreate) { return null; }
        return { kind: 'billing', tone: 'success', title: 'Payment received', message: `${money(b?.amount)} received${b?.method ? ` via ${b.method}` : ''}.` };
      }
      const patient = b?.patient_name ?? notif.label('billing', id) ?? 'a patient';
      if (isCreate) {
        return b?.status === 'paid'
          ? { kind: 'billing', tone: 'success', title: 'Invoice paid',      message: `${money(b?.total)} paid by ${patient}.` }
          : { kind: 'billing', tone: 'warning', title: 'Invoice generated', message: `${money(b?.total)} invoice for ${patient} — awaiting payment.` };
      }
      if (isDelete) { return { kind: 'billing', tone: 'danger', title: 'Invoice deleted', message: `An invoice for ${patient} was deleted.` }; }
      return b?.status === 'paid'
        ? { kind: 'billing', tone: 'success', title: 'Invoice paid',    message: `${money(b?.total)} paid by ${patient}.` }
        : { kind: 'billing', tone: 'info',    title: 'Invoice updated', message: `Invoice for ${patient} was updated.` };
    }

    case 'medical-records': {
      const patient = b?.patient_name ?? 'a patient';
      if (isCreate) { return { kind: 'record', tone: 'success', title: 'Medical record added', message: `New medical record for ${patient}.` }; }
      if (isDelete) { return { kind: 'record', tone: 'danger',  title: 'Medical record deleted', message: `A medical record was deleted.` }; }
      return          { kind: 'record', tone: 'info',    title: 'Medical record updated', message: `Record for ${patient} was updated.` };
    }

    default: return null;
  }
}