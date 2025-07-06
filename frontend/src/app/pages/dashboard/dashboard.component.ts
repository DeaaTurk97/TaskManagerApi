import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';


@Component({
  selector: 'app-dashboard',
  standalone: true, 
  templateUrl: './dashboard.component.html',
   imports: [ 
    HeaderComponent,   
    SidebarComponent,  
    RouterOutlet      
  ],
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}