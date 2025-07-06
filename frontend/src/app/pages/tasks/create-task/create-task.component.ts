import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
import { FormsModule, NgForm } from '@angular/forms';
import { TaskItem, TaskItemCreateDto, TaskStatus } from '../../../models/task.model';
import { User } from '../../../models/user.model';
import { TaskService } from '../task-service.service';
import { UserService } from '../../users/user-service.service';



@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss'
})
export class CreateTaskComponent implements OnInit {
  newTask: TaskItemCreateDto = {
    title: '',
    description: '',
    assignedToUserId: null,
    status: 'ToDo' 
  };

  users: User[] = []; 
  loading: boolean = true; 
  error: string | null = null; 
  successMessage: string | null = null; 

  taskStatuses: TaskStatus[] = ['ToDo', 'InProgress', 'Done']; 

  constructor(
    private router: Router,
    private taskService: TaskService, 
    private userService: UserService  
  ) { }

  ngOnInit(): void {
    this.loadUsers(); 
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load users for dropdown', err);
        this.error = 'Could not load users for assignment. Please try again.';
        this.loading = false;
      }
    });
  }

   onCreateTask(form: NgForm): void {
    if (form.invalid) {
      this.error = 'Please fill in all required fields.';
      form.control.markAllAsTouched(); 
      return; 
    }

    this.error = null;
    this.successMessage = null;

    this.taskService.createtask(this.newTask).subscribe({
      next: (response) => {
        this.successMessage = 'Task created successfully!';
        setTimeout(() => {
          this.router.navigate(['/dashboard/tasks']);
        }, 1500); 
      },
      error: (err) => {
        console.error('Error creating task:', err);
        this.error = err.error?.message || 'Failed to create task. Please try again.';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/tasks']);
  }
}