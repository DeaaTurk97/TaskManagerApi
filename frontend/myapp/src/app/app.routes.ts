import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { UserManagementComponent } from './pages/users/user-management.component';
import { TaskListComponent } from './pages/tasks/task-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EditTaskComponent } from './pages/tasks/edit-task/edit-task.component';
import { CreateTaskComponent } from './pages/tasks/create-task/create-task.component';
import { CreateUserComponent } from './pages/users/create-user/create-user.component';
import { EditUserComponent } from './pages/users/edit-user/edit-user.component';


export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginModule)
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'tasks', pathMatch: 'full' }, 
      { path: 'tasks', component: TaskListComponent },
      { path: 'tasks/edit/:id', component: EditTaskComponent },  
      { path: 'tasks/create', component: CreateTaskComponent },
      { path: 'users', component: UserManagementComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
      { path: 'users/create',component: CreateUserComponent,canActivate: [AuthGuard], data: { roles: ['Admin'] } },
      { path: 'users/edit/:id', component: EditUserComponent},
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];