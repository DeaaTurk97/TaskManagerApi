import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'; 
import { ActivatedRoute, Router } from '@angular/router'; 

import { User, UserUpdateDto } from '../../../models/user.model';
import { AuthService } from '../../../guards/auth.service';
import { UserService } from '../user-service.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit {
  userId: number | null = null;
  currentUser: User | null = null;
  userUpdateDto: UserUpdateDto = {}; 
  roles: string[] = ['Admin', 'User'];
  loading: boolean = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  submitting: boolean = false; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,     
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.userId = +idParam; 
        this.loadUser(this.userId);
      } else {
        this.errorMessage = 'User ID not provided in the route.';
        this.loading = false;
      }
    });
  }

  loadUser(id: number): void {
    this.loading = true;
    this.errorMessage = null;
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.currentUser = user;
        this.userUpdateDto = {
          username: user.username,
          role: user.role
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading user for update:', err);
        this.errorMessage = `Failed to load user with ID ${id}: ${err.error?.message || err.message}`;
        this.loading = false;
        if (err.status === 401 || err.status === 403) {
          this.authService.removeToken();
          this.router.navigate(['/login']);
        }
      }
    });
  }

 updateUser(form: NgForm): void {
    if (!this.userId) {
      this.errorMessage = 'User ID is missing. Cannot update.';
      return;
    }

    if (form.invalid) {
      this.errorMessage = 'Please fix the highlighted errors before submitting.';
      form.control.markAllAsTouched(); 
      return;
    }

    this.submitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    const payload: Partial<UserUpdateDto> = {
      username: this.userUpdateDto.username,
      role: this.userUpdateDto.role
    };
    if (this.userUpdateDto.password && this.userUpdateDto.password.length > 0) {
      payload.password = this.userUpdateDto.password;
    }

    this.userService.updateUser(this.userId, payload).subscribe({
      next: (response) => {
        this.successMessage = 'User updated successfully!';
        console.log('User updated:', response);
        this.submitting = false;
        setTimeout(() => {
          this.router.navigate(['/dashboard/users']);
        }, 1500); 
      },
      error: (err) => {
        this.submitting = false;
        console.error('Error updating user:', err);
        this.errorMessage = err.error?.message || 'Failed to update user. Please try again.';
        if (err.status === 401 || err.status === 403) {
          this.authService.removeToken();
          this.router.navigate(['/login']);
          this.errorMessage = 'Session expired or unauthorized. Please log in again.';
        }
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard/users']);
  }
}