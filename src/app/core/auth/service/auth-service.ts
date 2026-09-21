import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../model/login-request';
import { LoginResponse } from '../model/login-response';
import { ResetPasswordRequest } from '../model/reset-password-request';
import { SetPasswordRequest } from '../model/set-password-request';
import { SelectRoleRequest } from '../model/select-role-request';
import { AccountDto } from '../model/account-dto';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => {
        if (response.accessToken) {
          localStorage.setItem('access_token', response.accessToken);
        }
      }),
    );
  }

  selectRole(request: SelectRoleRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/select-role`, request).pipe(
      tap((response) => {
        if (response.accessToken) {
          localStorage.setItem('access_token', response.accessToken);
        }
      }),
    );
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(request: ResetPasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reset-password`, request);
  }

  setPassword(request: SetPasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/set-password`, request);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl.replace('/auth', '')}/accounts/me/password`, {
      currentPassword,
      newPassword,
    });
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      if (!payload.exp) {
        return false;
      }

      const expirationTime = payload.exp * 1000;

      if (Date.now() >= expirationTime) {
        this.logout();
        return false;
      }

      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  getCurrentAccount(): Observable<AccountDto> {
    return this.http.get<AccountDto>(`${this.apiUrl.replace('/auth', '')}/accounts/me`);
  }

  getActiveRole(): string | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      if (typeof payload.profile === 'string') {
        return payload.profile;
      }

      const roles = payload.roles;

      if (!roles || !Array.isArray(roles) || roles.length === 0) {
        return null;
      }

      return roles[0];
    } catch {
      return null;
    }
  }
}
