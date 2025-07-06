import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { endPoint } from '../../env';
import { AuthService } from '../../guards/auth.service';
import { User, UserCreateDto, UserUpdateDto } from '../../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiBaseUrl = `${endPoint}`; 

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiBaseUrl}Users`, { headers: this.getAuthHeaders() });
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiBaseUrl}Users/${id}`, { headers: this.getAuthHeaders() });
  }

  createUser(user: UserCreateDto): Observable<User> {
    return this.http.post<User>(`${this.apiBaseUrl}Users`, user, { headers: this.getAuthHeaders() });
  }

  updateUser(id: number, user: UserUpdateDto): Observable<User> {
    return this.http.put<User>(`${this.apiBaseUrl}Users/${id}`, user, { headers: this.getAuthHeaders() });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}Users/${id}`, { headers: this.getAuthHeaders() });
  }
}