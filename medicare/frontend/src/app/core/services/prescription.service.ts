import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Prescription, Paginated } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  private base = `${environment.apiUrl}/prescriptions/`;

  constructor(
    private http: HttpClient
  ) {}

  // Get all prescriptions
  list(): Observable<Paginated<Prescription>> {
    return this.http.get<Paginated<Prescription>>(this.base);
  }

  // Create prescription
  create(payload: any): Observable<Prescription> {
    return this.http.post<Prescription>(
      this.base,
      payload
    );
  }

  // Get single prescription
  get(id: number): Observable<Prescription> {
    return this.http.get<Prescription>(
      `${this.base}${id}/`
    );
  }

  // Update prescription
  update(
    id: number,
    payload: any
  ): Observable<Prescription> {
    return this.http.put<Prescription>(
      `${this.base}${id}/`,
      payload
    );
  }

  // Delete prescription
  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.base}${id}/`
    );
  }
}