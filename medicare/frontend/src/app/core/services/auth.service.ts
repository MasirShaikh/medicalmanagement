import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models';

interface LoginResponse { access: string; refresh: string; user: User; }

const ACCESS_KEY = 'medicare_access_token';
const REFRESH_KEY = 'medicare_refresh_token';
const USER_KEY = 'medicare_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(this.readStoredUser());

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login/`, { username, password })
      .pipe(
        tap((res) => {
          localStorage.setItem(ACCESS_KEY, res.access);
          localStorage.setItem(REFRESH_KEY, res.refresh);
          localStorage.setItem(USER_KEY, JSON.stringify(res.user));
          this.currentUser.set(res.user);
        })
      );
  }

  register(payload: Partial<User> & { password: string; username: string }) {
    return this.http.post(`${environment.apiUrl}/auth/register/`, payload);
  }

  logout(): void {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null { return localStorage.getItem(ACCESS_KEY); }
  isLoggedIn(): boolean { return !!this.getAccessToken(); }

  private readStoredUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  }
}
