import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private apiUrl = 'http://localhost:3000/upload';

  constructor(private http: HttpClient) {}

  uploadImage(file: File, type: string, id: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('id', id);

    return this.http.post(`${this.apiUrl}`, formData);
  }
}
