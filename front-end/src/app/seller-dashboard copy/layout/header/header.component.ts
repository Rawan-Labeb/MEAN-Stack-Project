import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../../_services/auth-service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userData: any = null;
  userName: string = 'Seller';

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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);  // Redirect to home page
  }
}