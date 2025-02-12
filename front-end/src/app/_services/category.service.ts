import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../_models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:5000/categories'; // ✨ تعديل حسب سيرفرك

  constructor(private http: HttpClient) {}

  // ✅ جلب جميع الفئات
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  getCategoriesActive(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/get/active`);
  }

  // ✅ جلب فئة واحدة حسب الـ ID
  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  // ✅ إنشاء فئة جديدة
  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  // ✅ تحديث فئة
  updateCategory(id: string, category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/${id}`, category);
  }

  // ✅ تبديل حالة الفئة (نشط/غير نشط)
  toggleCategoryStatus(id: string): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/toggle/${id}`, {});
  }

  // ✅ حذف فئة
  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
