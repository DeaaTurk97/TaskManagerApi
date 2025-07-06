import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; 
import { ActivatedRoute, Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { TaskItem, TaskItemUpdateDto, TaskStatus } from '../../../models/task.model';
import { User } from '../../../models/user.model';
import { TaskService } from '../task-service.service';
import { UserService } from '../../users/user-service.service';



@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe], 
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.scss'
})
export class EditTaskComponent implements OnInit {
  taskId: number | null = null;
  task: TaskItem | null = null; 
  loading: boolean = true; 
  error: string | null = null; 

  taskStatuses: TaskStatus[] = ['ToDo', 'InProgress', 'Done']; 
  users: User[] = []; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,      
    private taskService: TaskService, 
    private userService: UserService  
  ) { }

  ngOnInit(): void {
    this.loadUsers();

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.taskId = +idParam; 
        this.loadTaskDetails(this.taskId); 
      } else {
        console.error('Task ID not provided in route.');
        this.error = 'Task ID not found in the URL. Cannot edit.';
        this.router.navigate(['/dashboard/tasks']); 
      }
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Failed to load users for dropdown', err);
        this.error = 'Could not load users for assignment.';
      }
    });
  }

  loadTaskDetails(id: number): void {
    this.loading = true;
    this.error = null;
    this.taskService.getTaskById(id).subscribe({
      next: (data) => {
        this.task = data; 
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load task details:', err);
        this.error = 'Failed to load task details. Task not found or you are not authorized.';
        this.loading = false;
        this.router.navigate(['/dashboard/tasks']); 
      }
    });
  }

  onSubmit(): void {
    if (this.task && this.taskId !== null) {
      this.loading = true; 
      this.error = null;

      const updatedDto: TaskItemUpdateDto = {
        title: this.task.title,
        description: this.task.description,
        status: this.task.status,
        assignedToUserId: this.task.assignedToUserId,
      };

      this.taskService.updateTask(this.taskId, updatedDto).subscribe({
        next: (updatedTask) => {
          console.log('Task updated successfully:', updatedTask);
          this.loading = false;
          this.router.navigate(['/dashboard/tasks']); 
        },
        error: (err) => {
          console.error('Error updating task:', err);
          this.error = 'Failed to update task. Please ensure all fields are valid and you are authorized.';
          this.loading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard/tasks']);
  }
}