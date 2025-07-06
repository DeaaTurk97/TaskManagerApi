import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../guards/auth.service';
import { endPoint } from '../../env';
import { TaskItem, TaskItemUpdateDto } from '../../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {


  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

 
  getAllTasks(): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(`${endPoint}Tasks`, { headers: this.getAuthHeaders() });
  }

  
  updateTask(id: number, task: TaskItemUpdateDto): Observable<TaskItem> {
    return this.http.put<TaskItem>(`${endPoint}Tasks/${id}`, task, { headers: this.getAuthHeaders() });
  }

  
  getTaskById(id: number): Observable<TaskItem> {
    return this.http.get<TaskItem>(`${endPoint}Tasks/${id}`, { headers: this.getAuthHeaders() });
  }

  
  createtask(task: TaskItemUpdateDto): Observable<TaskItem> {
    return this.http.post<TaskItem>(`${endPoint}Tasks`, task, { headers: this.getAuthHeaders() });
  }

  updateTaskStatus(id: number, status: string): Observable<void> {
  return this.http.patch<void>(
    `${endPoint}Tasks/${id}/status`,
    { status }, 
    { headers: this.getAuthHeaders() }
  );
}

  
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${endPoint}Tasks/${id}`, { headers: this.getAuthHeaders() });
  }
}