import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductRequest } from '../models/product-request.model';

@Injectable({
  providedIn: 'root'
})
export class ProductRequestService {
  private apiUrl = 'http://localhost:5000/prodReq';

  constructor(private http: HttpClient) {}

  getProductRequestsBySeller(sellerId: string, token: string): Observable<ProductRequest[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<ProductRequest[]>(`${this.apiUrl}/getProdReqForSeller/${sellerId}`, { headers });
  }

  updateRequestStatus(id: string, status: string, message: string, token: string): Observable<ProductRequest> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<ProductRequest>(
      `${this.apiUrl}/updateProdReqStatusAndMsg/${id}`, 
      { status, message }, 
      { headers }
    );
  }
}