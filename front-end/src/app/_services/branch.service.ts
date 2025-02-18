import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable ,Subject} from 'rxjs';
import { Branch } from '../_models/branch.model';
import { tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  // private apiUrl = 'http://localhost:5000/branches';
  // private branchUpdated = new Subject<Branch>();
  //   constructor(private http: HttpClient) { }
  
  //   getAllBranches(): Observable<Branch[]> {
  //     return this.http.get<Branch[]>(this.apiUrl);
  //   }
  //   getbranchesBasedOnType(type: string): Observable<Branch[]> {
  //     return this.http.get<Branch[]>(`${this.apiUrl}/branchesByType/${type}`);
  //   }

  //   getUserById(id: string): Observable<Branch> {
  //     return this.http.get<Branch>(`${this.apiUrl}/getUserById/${id}`);
  //   }

  //   getUserByEmail(email: string): Observable<Branch> {
  //     return this.http.get<Branch>(`${this.apiUrl}/getUserByEmail/${email}`);
  //   }

  //   createUser(user: Branch): Observable<Branch> {
  //     const userData = JSON.parse(JSON.stringify(user));
  //     delete userData._id;
  //       console.log('Adding user:', userData);
  //       const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //       return this.http.post<Branch>(`${this.apiUrl}/register`, userData,{headers}).pipe(
  //           tap(createdUser => {
  //               console.log('user added successfully:', createdUser);
  //           })
  //       );
  //     }
  
  //   updateUser(id: string, user: Branch): Observable<Branch> {
  //     console.log('Updating user at:', `${this.apiUrl}/updateUser/${id}`);
  //       return this.http.put<Branch>(`${this.apiUrl}/updateUser/${id}`, user).pipe(
  //         tap(updateUser => {
  //           console.log('Update successful:', updateUser);
  //           this.userUpdated.next(updateUser);
  //         })
  //       );
  //   }
  //   activeUser(id: string, user: Branch): Observable<Branch> {
  //       return this.http.put<Branch>(`${this.apiUrl}/activateUser/${id}`, user).pipe(
  //         tap(updateUser => {
  //           console.log('Update successful:', updateUser);
  //           this.userUpdated.next(updateUser);
  //         })
  //       );
  //   }
  //   inActiveUser(id: string, user: Branch): Observable<Branch> {
  //       return this.http.put<Branch>(`${this.apiUrl}/deactivateUser/${id}`, user).pipe(
  //         tap(updateUser => {
  //           console.log('Update successful:', updateUser);
  //           this.userUpdated.next(updateUser);
  //         })
  //       );
  //   }
    
  //   deleteUser(id: string): Observable<void> {
  //       console.log('Deleting product at:', `${this.apiUrl}/deleteUser/${id}`);
  //       return this.http.delete<void>(`${this.apiUrl}/deleteUser/${id}`).pipe(
  //         tap(() => console.log('Delete successful'))
  //       );
  //     }
  //     onUserUpdate(): Observable<Branch> {
  //         return this.userUpdated.asObservable();
  //     }
}
