import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../guards/auth.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { UserService } from './user-service.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  allUsers: User[] = []; 
  users: User[] = [];    
  loading = true;
  error: string | null = null;
  isAdmin: boolean = false;

  currentPage: number = 1;
  pageSize: number = 5; 
  totalItems: number = 0;
  totalPages: number = 0;

  showConfirmModal: boolean = false;
  confirmMessage: string = '';
  userToDelete: User | null = null;
  currentLoggedInUserId: number | null = null;

  constructor(
    private userService: UserService,
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();

    const currentUserInfo = this.authService.getUserInfo();
    if (currentUserInfo) {
      this.currentLoggedInUserId = currentUserInfo.id;
    } else {
      console.warn('Could not retrieve current user info. User ID for deletion checks may be unavailable.');
    }

    this.loadAllUsersAndPaginate(); 
  }

  loadAllUsersAndPaginate(): void {
    this.loading = true;
    this.error = null;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.allUsers = data; 
        this.totalItems = data.length;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.applyPagination();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.error = 'Failed to load users. Please try again later.';
        this.loading = false;
        if (err.status === 401 || err.status === 403) {
          this.authService.removeToken();
          this.router.navigate(['/login']);
          this.error = 'Session expired or unauthorized. Please log in again.';
        }
      }
    });
  }

  applyPagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.users = this.allUsers.slice(startIndex, endIndex);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyPagination(); 
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyPagination(); 
    }
  }

  goToCreateUser(): void {
    if (this.isAdmin) {
      this.router.navigate(['/dashboard/users/create']);
    }
  }

  confirmDelete(user: User): void {
    this.userToDelete = user;
    this.confirmMessage = `Are you sure you want to delete user "${user.username}" (ID: ${user.id})? This action cannot be undone.`;
    this.showConfirmModal = true;
  }

  cancelDelete(): void {
    this.showConfirmModal = false;
    this.userToDelete = null;
    this.confirmMessage = '';
  }

  executeDelete(): void {
    if (this.userToDelete && this.userToDelete.id !== undefined && this.userToDelete.id !== null) {
      this.userService.deleteUser(this.userToDelete.id).subscribe({
        next: () => {
          console.log(`User ${this.userToDelete?.username} deleted successfully.`);
          this.showConfirmModal = false;
          this.userToDelete = null;
          this.confirmMessage = '';
          this.loadAllUsersAndPaginate(); 
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          this.error = `Failed to delete user: ${err.error?.message || err.message}`;
          this.showConfirmModal = false;
          this.userToDelete = null;
          this.confirmMessage = '';
          if (err.status === 401 || err.status === 403) {
            this.authService.removeToken();
            this.router.navigate(['/login']);
          }
        }
      });
    } else {
      console.error('No user selected for deletion or user ID is invalid.');
      this.cancelDelete();
    }
  }

  editUser(userId: number): void {
    if (this.isAdmin) {
      this.router.navigate(['/dashboard/users/edit', userId]);
    } else {
      console.warn('User is not an admin. Cannot edit user.');
    }
  }
}