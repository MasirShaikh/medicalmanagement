export interface Role { id: number; name: string; }

export interface User {
  id: number; username: string; email: string; first_name: string; last_name: string;
  phone: string; role: Role | null; is_active: boolean; date_joined: string;
}

export interface Department { id: number; name: string; description: string; doctor_count: number; }

export type DoctorStatus = 'available' | 'on_leave';

export interface Doctor {
  id: number; name: string; specialization: string; department: number | null;
  department_name: string; email: string; phone: string; experience_years: number;
  qualification: string; consultation_fee: number; available_days: string;
  available_time: string; status: DoctorStatus; created_at: string;
}

export type Gender = 'male' | 'female' | 'other';

export interface Patient {
  id: number; full_name: string; email: string; phone: string; date_of_birth: string | null;
  age: number | null; gender: Gender; address: string; blood_group: string;
  emergency_contact: string; created_at: string;
}

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
  id: number; patient: number; patient_name: string; doctor: number; doctor_name: string;
  date: string; time: string; status: AppointmentStatus; notes: string; created_at: string;
}

export interface SlotInfo { time: string; available: boolean; }
export interface AvailableSlotsResponse { doctor: number; date: string; slots: SlotInfo[]; }

export interface PrescriptionItem {
  id?: number; medicine_name: string; dosage: string; frequency: string; duration: string; instructions: string;
}
export interface Prescription {
  id: number; patient: number; patient_name: string; doctor: number | null; doctor_name: string;
  diagnosis: string; notes: string; items: PrescriptionItem[]; created_at: string;
}

export interface InvoiceItem { id?: number; description: string; amount: number; }
export type InvoiceStatus = 'paid' | 'pending' | 'partial' | 'cancelled';
export interface Invoice {
  id: number; patient: number; patient_name: string; appointment: number | null;
  items: InvoiceItem[]; subtotal: number; discount: number; total: number;
  status: InvoiceStatus; created_at: string;
}

export interface MedicalRecord {
  id: number; patient: number; patient_name: string; doctor: number | null; doctor_name: string;
  appointment: number | null; symptoms: string; diagnosis: string; notes: string;
  blood_pressure: string; weight_kg: number | null; temperature_c: number | null; created_at: string;
}

export interface Paginated<T> { count: number; next: string | null; previous: string | null; results: T[]; }

export interface DashboardStatistics {
  range: string;
  cards: { total_patients: number; appointments: number; available_doctors: number; pending_payments: number; };
  appointment_status: { scheduled: number; completed: number; cancelled: number; no_show: number; };
  revenue: number;
  doctor_performance: { id: number; name: string; appt_count: number; completed_count: number; }[];
}
