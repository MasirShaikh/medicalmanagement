import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  Invoice,
  Paginated,
  Patient
} from '../models';


@Injectable({
  providedIn: 'root'
})
export class BillingService {

  private base = `${environment.apiUrl}/billing/`;

  private patientsBase = `${environment.apiUrl}/patients/`;


  constructor(
    private http: HttpClient
  ) {}


  // GET invoices

  list(): Observable<Paginated<Invoice>> {

    return this.http.get<Paginated<Invoice>>(this.base);

  }


  // GET patients

  getPatients(): Observable<Paginated<Patient>> {

    return this.http.get<Paginated<Patient>>(this.patientsBase);

  }


  // POST invoice

  create(payload: any): Observable<Invoice> {

    return this.http.post<Invoice>(
      this.base,
      payload
    );

  }

}