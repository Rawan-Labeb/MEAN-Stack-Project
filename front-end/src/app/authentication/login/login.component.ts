import { Component, OnInit } from '@angular/core';
import { Login } from '../../_models/login';
import { FormsModule } from '@angular/forms'; // Import FormsModule
// import { UserServiceService } from '../../_services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [CookieService]
})
export class LoginComponent 
{
  login:Login = new Login("","", "");
  constructor(
    public loginSer:UserService,
    public cookieService:CookieService
  ){

  }


  loginn() {
    // this.loginSer.login(this.login).subscribe({
    //   next: (data) => {
    //     // console.log(data.token);
    //     this.cookieService.set('token', data.token);
    //   },
    //   error: () => console.log("Bad request")
    // });
  }
  



  // setToken(token: string) {
  //   this.cookieService.set('token', token, { secure: true });
  // }


}
