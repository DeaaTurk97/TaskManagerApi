import { Component } from '@angular/core';
import { AuthService } from '../../guards/auth.service'; 

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(private authService: AuthService) { }

  logout() {
    this.authService.removeToken(); 
  }
}