
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Import AuthService

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/auth/users'; // Updated base URL

  constructor(private http: HttpClient, private authService: AuthService) { } // Inject AuthService

  private getAuthHeaders(): HttpHeaders {
    const authData = this.authService['getAuthData'](); // Access private method for now
    const token = authData ? authData.token : null;

    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
    } else {
      // Handle case where token is not available (e.g., user not logged in)
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  getUser(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createUser(user: any): Observable<any> {
    return this.http.post(this.baseUrl, user, { headers: this.getAuthHeaders() });
  }

  updateUser(id: string, user: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, user, { headers: this.getAuthHeaders() });
  }
}
