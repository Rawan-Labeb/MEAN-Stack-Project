import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthServiceService } from '../../../_services/auth-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HeaderComponent implements OnInit {
  @Input() pageTitle: string = 'Sales Clerk Dashboard';
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  
  userData: any = null;
  userName: string = 'Sales Clerk';

  constructor(
    private router: Router,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.getUserFromToken();
  }

  getUserFromToken(): void {
    const token = this.authService.getToken();
    if (token) {
      try {
        this.authService.decodeToken(token).subscribe(decodedData => {
          this.userData = decodedData;
          // Get name if available
          if (this.userData?.firstName && this.userData?.lastName) {
            this.userName = `${this.userData.firstName} ${this.userData.lastName}`;
          } else if (this.userData?.username) {
            this.userName = this.userData.username;
          }
        });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }

  toggleSidebar(): void {
    this.toggleSidebarEvent.emit();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']); // Redirect to home page
  }
}