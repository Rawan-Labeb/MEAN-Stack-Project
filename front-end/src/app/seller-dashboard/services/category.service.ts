import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Category } from '../models/product.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  // Predefined categories for perfumes
  private categories: Category[] = [
    { 
      _id: '65f1c3b1e32f6a6e85d2a111', 
      name: 'Luxury Perfumes',
      description: 'Luxury perfume collection',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    { 
      _id: '65f1c3b1e32f6a6e85d2a222', 
      name: 'Designer Fragrances',
      description: 'Designer fragrance collection',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    { 
      _id: '65f1c3b1e32f6a6e85d2a333', 
      name: 'Niche Perfumes',
      description: 'Niche perfume collection',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    { 
      _id: '65f1c3b1e32f6a6e85d2a444', 
      name: 'Classic Collections',
      description: 'Classic perfume collection',
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ];

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    // Return static categories instead of making an HTTP request
    return of(this.categories);
  }
}
