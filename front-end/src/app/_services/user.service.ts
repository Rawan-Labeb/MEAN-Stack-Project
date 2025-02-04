import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { Login } from '../_models/login';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private url:string = "http://localhost:5000/users/";
  constructor(public http:HttpClient) { }

  login(user:Login)
  {
    return this.http.post<Login>(this.url+"login", user, {})
  }

}
