import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../_models/login';
import { register } from '../_models/register';
import { userProfile } from '../_models/userProfile.model';

// import * as jwt from 'jsonwebtoken';
// import { default as jwt_decode } from 'jwt-decode';
// import {default as jwt_decode} from "jwt-decode"
import {jwtDecode }from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private apiUrl = 'http://localhost:5000/api/users';
  
  constructor(
    private http: HttpClient,

  ) { }


  // login 
  login(loginData:Login): Observable<Login>
  {
    return this.http.post<Login>(`${this.apiUrl}/login`,loginData);
  }
  // register
  register(userData:register): Observable<register>
  {
    return this.http.post<register>(`${this.apiUrl}/register`,userData)
  }

  // get user by email
  // getUserDataByEmail (email:string)
  // {
  //   return this.http.get<userProfile>(`${this.apiUrl}/getUserByEmail`, email);
  // }
  getUserDataByEmail(email: string) {
    return this.http.get<userProfile>(`${this.apiUrl}/getUserByEmail/${email}`);
  }
  



  // decode token
  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  }

}
