import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from '../_services/auth-service.service';
import { empty, firstValueFrom, Observable, of } from 'rxjs';
// >>>>>>>>> import { CartService } from '../cart/service/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [CommonModule,RouterLink],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userRole:string|null=null;//='customer';
  isauthenticated:boolean=false;
  userFirstName:string = "";
  token:any;
  userEmail:any;
  userData: any = {}; 
  branchName: string = "";

  async ngOnInit() {
    // await this.loadUserRole();
    // this.userFirstName = this.userData ?  this.userData.firstName : "";

    this.userRole = this.authSer.decodeTokenHead(this.authSer.getToken()).role;
    this.authSer.loginStatus.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        let claims = this.authSer.decodeTokenHead(this.authSer.getToken());
        this.userRole = claims?.role;
        this.userEmail = claims?.email;
        
        this.authSer.getUserDataByEmail(this.userEmail).subscribe({
          next: (data) => {
            console.log(data);
            if (data && data.firstName) {
              this.userFirstName = data.firstName;
              console.log('User First Name:', this.userFirstName);
              this.userData = data; // Assuming you have a `userData` property
              this.cdRef.detectChanges();
            } else {
              console.error('First name is missing or invalid');
            }
          },
          error: (err: any) => console.error('Error fetching user data', err)
        });
        console.log("User Name Is : " ,this.userFirstName);
      } else {
        this.userRole = null;
      }
    });
  }


  constructor(
    public cookieSer:CookieService,
    public router:Router,
    public authSer:AuthServiceService,
    private cdRef: ChangeDetectorRef
 //>>>>>>>>>>   private cartService: CartService
  )
  {

  }



  LogOut(): void {
    this.authSer.logout();
    this.router.navigateByUrl('');
    this.isauthenticated = false;
  
    // Reset user-related properties
    this.userRole = null;
    this.userEmail = null;
    this.userData = null;
  }


  
  fetchUserDataByEmail(): void {
    if (!this.userEmail) {
      console.error('No email available to fetch user data');
      return;
    }
  
    this.authSer.getUserDataByEmail(this.userEmail).subscribe({
      next: (userData) => {
        console.log(userData);
        if (userData && userData.firstName) {
          this.userFirstName = userData.firstName;
          console.log('User First Name:', this.userFirstName);
          // Example: Store user data in a property
          this.userData = userData; // Assuming you have a `userData` property
        } else {
          console.error('First name is missing or invalid');
        }
      },
      error: (err: any) => console.error('Error fetching user data', err)
    });
  }

  selected: string = 'home';
  updateSelect(selectedd: string): void {
    this.selected = selectedd;
  }

}