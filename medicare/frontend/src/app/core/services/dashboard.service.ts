import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardStatistics } from '../models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient) {}

  getStatistics(range: 'today' | '7d' | '30d' = 'today'): Observable<DashboardStatistics> {
    const params = new HttpParams().set('range', range);
    return this.http.get<DashboardStatistics>(`${environment.apiUrl}/reports/dashboard-statistics/`, { params });
  }
}
