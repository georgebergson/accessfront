import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

interface AuthData {
  id: number; // Add id to the interface
  token: string;
  role: string;
  admin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';
  private isBrowser: boolean;
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    console.log('AuthService constructor: isBrowser =', this.isBrowser);
    if (this.isBrowser) {
      const loggedIn = !!localStorage.getItem('authData');
      this._isLoggedIn.next(loggedIn);
      console.log('AuthService constructor: Initial isLoggedIn =', loggedIn);
    }
  }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ username, password });

    return this.http.post<AuthData>(`${this.baseUrl}/login`, body, { headers }).pipe(
      map((res: AuthData) => {
        console.log('Login successful, response:', res);
        if (res.token && this.isBrowser) {
          localStorage.setItem('authData', JSON.stringify(res)); // Store entire response
          this._isLoggedIn.next(true);
          console.log('Login: authData stored, isLoggedIn set to true');
        }
        return res;
      }),
      catchError((err) => {
        console.error('Login error:', err);
        return throwError(() => err.error);
      })
    );
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('authData'); // Remove entire authData
      this._isLoggedIn.next(false);
      console.log('Logout: authData removed, isLoggedIn set to false');
      this.router.navigate(['/login']);
    }
  }

  isLoggedIn(): boolean {
    const loggedIn = this.isBrowser && !!localStorage.getItem('authData');
    console.log('isLoggedIn() called, returning:', loggedIn);
    return loggedIn;
  }

  private getAuthData(): AuthData | null {
    if (!this.isBrowser) {
      return null;
    }
    const authDataString = localStorage.getItem('authData');
    console.log('getAuthData(): authDataString =', authDataString);
    if (authDataString) {
      try {
        const data = JSON.parse(authDataString) as AuthData;
        console.log('getAuthData(): parsed data =', data);
        return data;
      } catch (e) {
        console.error('Error parsing authData from localStorage', e);
        return null;
      }
    }
    return null;
  }

  getUserRole(): string | null {
    const authData = this.getAuthData();
    const role = authData ? authData.role : null;
    console.log('getUserRole(): role =', role);
    return role;
  }

  isAdmin(): boolean {
    const authData = this.getAuthData();
    const admin = authData ? authData.admin : false;
    console.log('isAdmin(): admin =', admin);
    return admin;
  }

  getUserId(): string | null {
    const authData = this.getAuthData();
    const userId = authData ? String(authData.id) : null;
    console.log('getUserId(): userId =', userId);
    return userId;
  }
}
