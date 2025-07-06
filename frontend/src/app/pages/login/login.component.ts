import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from './login-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  error: string = '';

  constructor
  (
    private service: LoginServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  login() {
    this.error = ''; 
    let obj = {
      "username": this.username,
      "password": this.password
    };

    this.service.getUser(obj).subscribe({
      next: (res) => {
        console.warn('Login successful:', res);
        
        localStorage.setItem('jwt_token', res.token);
        localStorage.setItem('user_info', JSON.stringify(res.user));
        this.router.navigate(['/dashboard']); 
      },
      error: (err) => { 
        console.error('Login error:', err);
        
        if (err.status === 401 && err.error && err.error.message) {
          this.error = err.error.message; 
        } else {
          this.error = 'An unexpected error occurred during login. Please try again.';
        }
      }
    });
  }
}