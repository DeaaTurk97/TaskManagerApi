import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { UserCreateDto } from '../../../models/user.model';
import { Router } from '@angular/router';
import { AuthService } from '../../../guards/auth.service'; 
import { UserService } from '../user-service.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent implements OnInit {
  newUser: UserCreateDto = {
    username: '',
    password: '',
    role: 'User' 
  };
  roles: string[] = ['Admin', 'User']; 
  errorMessage: string | null = null;
  successMessage: string | null = null;
  loading: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  createUser(): void {
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (!this.newUser.username || !this.newUser.password || !this.newUser.role) {
      this.errorMessage = 'Please fill in all required fields.';
      this.loading = false;
      return;
    }

    this.userService.createUser(this.newUser).subscribe({
      next: (createdUser) => {
        this.successMessage = `User "${createdUser.username}" created successfully!`;
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/dashboard/users']);
        }, 1500); 
      },
      error: (err) => {
        console.error('Error creating user:', err);
        this.errorMessage = `Failed to create user: ${err.error?.message || err.message || 'Unknown error'}`;
        this.loading = false;
        if (err.status === 401 || err.status === 403) {
          this.authService.removeToken();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard/users']);
  }
}