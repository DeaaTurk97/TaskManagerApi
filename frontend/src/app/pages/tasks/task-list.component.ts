import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { TaskItem, TaskItemUpdateDto, TaskStatus } from '../../models/task.model';
import { TaskService } from './task-service.service';
import { AuthService } from '../../guards/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  allTasks: TaskItem[] = [];
  tasks: TaskItem[] = [];
  loading = true;
  error: string | null = null;
  isAdmin: boolean = false;
  taskStatuses: TaskStatus[] = ['ToDo', 'InProgress', 'Done'];

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;

  showConfirmModal: boolean = false;
  taskToDelete: TaskItem | null = null;
  confirmMessage: string = '';

  constructor(
    private taskService: TaskService,
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.error = null;
    this.taskService.getAllTasks().subscribe({
      next: (data) => {
        this.allTasks = data;
        this.totalItems = this.allTasks.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.paginateTasks();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load tasks', err);
        this.error = 'Failed to load tasks. Please try again later.';
        this.loading = false;
        if (err.status === 401 || err.status === 403) {
            this.authService.removeToken();
        }
      }
    });
  }

  paginateTasks(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.tasks = this.allTasks.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateTasks();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateTasks();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateTasks();
    }
  }

  updateTaskStatus(task: TaskItem, newStatus: TaskStatus): void {
  this.taskService.updateTaskStatus(task.id, newStatus).subscribe({
    next: () => {
      const allTasksIndex = this.allTasks.findIndex(t => t.id === task.id);
      if (allTasksIndex !== -1) {
        this.allTasks[allTasksIndex].status = newStatus; 
      }
      this.paginateTasks();
      console.log(`Task ${task.id} status updated to ${newStatus}`);
    },
    error: (err) => {
      console.error(`Failed to update task ${task.id}`, err);
      this.error = `Failed to update task ${task.id}. Check console for details.`;
      this.paginateTasks();
    }
  });
}


   goToCreateTask(): void {
    this.router.navigate(['/dashboard/tasks/create']);
  }

   editTask(taskId: number): void {
    this.router.navigate(['/dashboard/tasks/edit', taskId]);
  }

  confirmDelete(task: TaskItem): void {
    this.taskToDelete = task;
    this.confirmMessage = `Are you sure you want to delete the task "${task.title}"?`;
    this.showConfirmModal = true;
  }

  cancelDelete(): void {
    this.showConfirmModal = false;
    this.taskToDelete = null;
    this.confirmMessage = '';
  }

  executeDelete(): void {
    if (this.taskToDelete) {
      this.taskService.deleteTask(this.taskToDelete.id).subscribe({
        next: () => {
          console.log(`Task ${this.taskToDelete?.id} deleted successfully.`);
          this.cancelDelete(); 
          this.loadTasks(); 
        },
        error: (err) => {
          console.error(`Failed to delete task ${this.taskToDelete?.id}`, err);
          this.error = `Failed to delete task "${this.taskToDelete?.title}". Not authorized or an error occurred.`;
          this.cancelDelete(); 
        }
      });
    }
  }
}