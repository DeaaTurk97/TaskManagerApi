import { Injectable } from '@angular/core';
import { Router } from '@angular/router'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { } 

  setToken(token: string) {
    localStorage.setItem('jwt_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

 
 getUserInfo(): { id: number, username: string, role: string } | null {
    const userInfoString = localStorage.getItem('user_info');
    if (userInfoString) {
      try {
        const parsedInfo = JSON.parse(userInfoString);
        return {
          id: parsedInfo.id,
          username: parsedInfo.username,
          role: parsedInfo.role
        };
      } catch (e) {
        console.error('Error parsing user info from localStorage', e);
        return null;
      }
    }
    return null;
  }
  
  getUserRole(): string | null {
    const userInfo = this.getUserInfo();
    return userInfo ? userInfo.role : null;
  }

  
  isAdmin(): boolean {
    return this.getUserRole() === "Admin"; 
  }

 
  removeToken() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_info');
   
    this.router.navigate(['/login']);
  }
}