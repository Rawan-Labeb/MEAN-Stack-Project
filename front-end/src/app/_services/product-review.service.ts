import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductReviewService {


  private apiUrl = 'http://localhost:5000/prodReview';

  constructor(
    private http: HttpClient
  ) { }

  // createReviewOnProduct (review:any)
  // {
  //   return this.http.post(`${this.apiUrl}/createReview`,review);
  // }

  createReviewOnProduct(review: any) {
    return this.http.post(`${this.apiUrl}/createReview`, review, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true, // If authentication is required
    });
  }
  



  getReviewsByProductId (id:any) : Observable<any[]>
  {
    return this.http.get<any[]>(`${this.apiUrl}/getReviewsByProduct/${id}`)
  }

  deleteReviewById (id:any)
  {
    return this.http.delete(`${this.apiUrl}/deleteReview/${id}`)
  }
  
  getReviewById (id:any)
  {
    return this.http.get(`${this.apiUrl}/getReviewById/${id}`)
  }

  getReviewsByUserId (id:any)
  {
    return this.http.get(`${this.apiUrl}/getReviewsByUser/${id}`)
  }
}
