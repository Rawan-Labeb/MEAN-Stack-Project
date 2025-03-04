import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private backendUrl = 'http://localhost:5000'; 

  constructor(private http: HttpClient) {}

  createCheckoutSession(priceId: string) {
    return this.http.post(`${this.backendUrl}/create-checkout-session`, { priceId });
  }
}