import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Appointment, AvailableSlotsResponse, Paginated } from '../models';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private base = `${environment.apiUrl}/appointments/`;
  constructor(private http: HttpClient) {}

  list(params: { status?: string; doctor?: number } = {}): Observable<Paginated<Appointment>> {
    let p = new HttpParams();
    Object.entries(params).forEach(([k, v]) => { if (v) p = p.set(k, String(v)); });
    return this.http.get<Paginated<Appointment>>(this.base, { params: p });
  }

  create(payload: Partial<Appointment>): Observable<Appointment> {
    return this.http.post<Appointment>(this.base, payload);
  }

  update(id: number, payload: Partial<Appointment>): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.base}${id}/`, payload);
  }

  /** Backend tells us exactly which slots are free for this doctor+date — this is
   *  what prevents double-booking: the UI only ever offers slots the API marks available. */
  availableSlots(doctorId: number, date: string): Observable<AvailableSlotsResponse> {
    const params = new HttpParams().set('doctor', doctorId).set('date', date);
    return this.http.get<AvailableSlotsResponse>(`${this.base}available-slots/`, { params });
  }
}
