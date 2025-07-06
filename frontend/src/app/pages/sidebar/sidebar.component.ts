import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../guards/auth.service'; 
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  imports: [
    CommonModule,        
    RouterLink,
    RouterLinkActive
  ]
})
export class SidebarComponent implements OnInit {
  isAdmin: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin(); 
  }
}