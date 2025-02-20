import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SellerUploadService {
  private apiUrl = 'http://localhost:5000/api/upload/upload';

  constructor(private http: HttpClient) {}

  uploadProductImages(files: FileList): Observable<{ imageUrls: string[] }> {
    const formData = new FormData();
    
    // Log the files being uploaded
    console.log('Uploading files:', files);
    
    for (let i = 0; i < files.length; i++) {
      formData.append('imageUrls', files[i]);
    }
    
    return this.http.post<{ imageUrls: string[] }>(this.apiUrl, formData).pipe(
      tap(response => {
        console.log('Upload response from server:', response);
      })
    );
  }
}