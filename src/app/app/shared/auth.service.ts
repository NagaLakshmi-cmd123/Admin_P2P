import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private LOGIN_URL = 'http://44.198.84.209:8085/api/auth/login';

  constructor(private http: HttpClient) {}

  // LOAD USER PROFILE AFTER LOGIN
  loadProfile() {
    this.http.get('http://44.198.84.209:8085/api/user/profile').subscribe({
      next: (res: any) => {
        if (res.success && res.profile) {
          localStorage.setItem('adminId', res.profile.id);
          localStorage.setItem('adminName', res.profile.displayName);
           localStorage.setItem('adminPhone', res.profile.phone); // ADD THIS
        }
      },
      error: (err) => {
        console.error('Profile load failed:', err);
      }
    });
  }

  // LOGIN API
  login(emailOrPhone: string, password: string): Observable<any> {
    return this.http.post(this.LOGIN_URL, { emailOrPhone, password }).pipe(
      tap((res: any) => {
        if (res.success && res.tokens?.access_token) {

          // Save token
          localStorage.setItem('authToken', res.tokens.access_token);

          // Load adminId + adminName
          this.loadProfile();
        }
      })
    );
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Logout
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminName');
  }

  // Check login status
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }
}
