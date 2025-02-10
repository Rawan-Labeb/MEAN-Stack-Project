import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user.model';
// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { User } from '../_models/user';
import { Login } from '../_models/login';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/users';
  
    constructor(private http: HttpClient) { }
  
    // Get all Users
    getAllUsers(): Observable<User[]> {
      return this.http.get<User[]>(this.apiUrl);
    }
  
    // Get a single User by ID
    getUserById(id: string): Observable<User> {
      return this.http.get<User>(`${this.apiUrl}/${id}`);
    }
  
    // Create a new User
    createUser(product: User): Observable<User> {
      return this.http.post<User>(this.apiUrl, product);
    }
  
    // Update an existing User
    updateUser(id: string, product: User): Observable<User> {
      return this.http.put<User>(`${this.apiUrl}/${id}`, product);
    }
  
    // Delete a User
    deleteUser(id: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/${id}`);
    }




}
