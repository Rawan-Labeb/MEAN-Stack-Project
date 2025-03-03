import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from 'src/app/_services/auth-service.service';
import { firstValueFrom } from 'rxjs';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-header',
  imports: [MatSidenavModule,MatIconModule,MatListModule,MatToolbarModule,MatMenuModule,MatDividerModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();
  userData: any = null;
  userId: string='';
  user:any=null
  loading = false;
  error: string | null = null;

  constructor(private router: Router,private authService: AuthServiceService,
    private UserService: UserService , private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getUserFromToken();
    this.loadUser();
  }

  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }

  getUserFromToken() {
    const token = this.authService.getToken();
    if (token) {
      try {
        this.authService.decodeToken(token).subscribe(decodedData => {
          this.userData = decodedData;
          console.log('admine', this.userData);
          this.userId = this.userData?.sub||'';
        });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }

  async loadUser(): Promise<void> {
        this.loading = true;
        this.error = null;
        
        try {
          const data = await firstValueFrom(this.UserService.getUserById(this.userId));
          this.user = data
          this.cdr.detectChanges();
        } catch (error) {
          console.error('❌ Error loading user', error);
          this.error = 'Failed to load user';
        } finally {
          this.loading = false;
          this.cdr.detectChanges();
        }
      }

      logout() {
        this.authService.logout();
        this.router.navigate(['user/login']);
      }
  
}
