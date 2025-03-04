import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Category } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    // According to API docs: GET /categories
    return this.http.get<Category[]>(`${this.apiUrl}/categories`).pipe(
      catchError(error => {
        console.error('Error fetching categories:', error);
        return of([]);
      })
    );
  }

  getActiveCategories(): Observable<Category[]> {
    // According to API docs: GET /categories/get/active
    return this.http.get<Category[]>(`${this.apiUrl}/categories/get/active`).pipe(
      catchError(error => {
        console.error('Error fetching active categories:', error);
        return of([]);
      })
    );
  }

  getCategoryById(id: string): Observable<Category> {
    // According to API docs: GET /categories/{id}
    return this.http.get<Category>(`${this.apiUrl}/categories/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching category with ID ${id}:`, error);
        return of({} as Category);
      })
    );
  }

  getCategoryByName(name: string): Observable<Category> {
    // According to API docs: GET /categoryByName/{name}
    return this.http.get<Category>(`${this.apiUrl}/categoryByName/${name}`).pipe(
      catchError(error => {
        console.error(`Error fetching category with name ${name}:`, error);
        return of({} as Category);
      })
    );
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    // According to API docs: POST /categories
    return this.http.post<Category>(`${this.apiUrl}/categories`, category);
  }

  updateCategory(id: string, categoryData: Partial<Category>): Observable<Category> {
    // According to API docs: PUT /categories/{id}
    return this.http.put<Category>(`${this.apiUrl}/categories/${id}`, categoryData);
  }

  toggleCategoryStatus(id: string): Observable<Category> {
    // According to API docs: PUT /categories/toggle/{id}
    return this.http.put<Category>(`${this.apiUrl}/categories/toggle/${id}`, {});
  }

  deleteCategory(id: string): Observable<void> {
    // According to API docs: DELETE /categories/{id}
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}`);
  }
}
