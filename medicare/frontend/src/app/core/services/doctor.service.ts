import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Doctor, Paginated } from '../models';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private base = `${environment.apiUrl}/doctors/`;
  constructor(private http: HttpClient) {}

  list(): Observable<Paginated<Doctor>> { return this.http.get<Paginated<Doctor>>(this.base); }
  get(id: number): Observable<Doctor> { return this.http.get<Doctor>(`${this.base}${id}/`); }
  create(payload: Partial<Doctor>): Observable<Doctor> { return this.http.post<Doctor>(this.base, payload); }
  update(id: number, payload: Partial<Doctor>): Observable<Doctor> { return this.http.put<Doctor>(`${this.base}${id}/`, payload); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.base}${id}/`); }
}
