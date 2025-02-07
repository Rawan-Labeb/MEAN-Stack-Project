import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../_models/contact.model';
@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private apiUrl = 'https://localhost:3000/contact';

  constructor(private http: HttpClient) {}

  sendContactForm(contactData: Contact): Observable<any> {
    return this.http.post<any>(this.apiUrl, contactData);
  }
  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl);
}
updateContactStatus(id: string, status: 'Replied' | 'Pending'): Observable<any> {
  return this.http.patch(`${this.apiUrl}/${id}`, { status });
}
deleteContact(id:string): Observable<any> {
  return this.http.delete(`${this.apiUrl}//${id}`);
}
}
