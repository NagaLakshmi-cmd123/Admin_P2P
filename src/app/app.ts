import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SidebarComponent } from './app/layout/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  sidebarOpen = signal(true);

  constructor(private router: Router) {}

  // Hide sidebar on login page
  isLoginPage() {
    return this.router.url === '/login';
  }

  toggleSidebar() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }
}
