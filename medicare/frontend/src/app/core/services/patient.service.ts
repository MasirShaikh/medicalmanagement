import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Paginated, Patient } from '../models';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private base = `${environment.apiUrl}/patients/`;
  constructor(private http: HttpClient) {}

  list(params: { search?: string } = {}): Observable<Paginated<Patient>> {
    let p = new HttpParams();
    Object.entries(params).forEach(([k, v]) => { if (v) p = p.set(k, v as string); });
    return this.http.get<Paginated<Patient>>(this.base, { params: p });
  }
  get(id: number): Observable<Patient> { return this.http.get<Patient>(`${this.base}${id}/`); }
  create(payload: Partial<Patient>): Observable<Patient> { return this.http.post<Patient>(this.base, payload); }
  update(id: number, payload: Partial<Patient>): Observable<Patient> { return this.http.put<Patient>(`${this.base}${id}/`, payload); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.base}${id}/`); }
}
