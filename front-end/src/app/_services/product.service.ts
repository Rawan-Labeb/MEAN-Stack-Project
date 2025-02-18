import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,Subject } from 'rxjs';
import { Product } from '../_models/product.model';
import { tap} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:5000/api/products';
  private productUpdated = new Subject<Product>();
  constructor(private http: HttpClient) { }
  
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
        tap(createdProduct => {
            console.log('Product added successfully:', createdProduct);
        })
    );
}


  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product).pipe(
      tap(updatedProduct => {
        console.log('Update successful:', updatedProduct);
        this.productUpdated.next(updatedProduct);
      })
    );
}


  deleteProduct(id: string): Observable<void> {
    console.log('Deleting product at:', `${this.apiUrl}/${id}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log('Delete successful'))
    );
  }
  onProductUpdate(): Observable<Product> {
      return this.productUpdated.asObservable();
  }

}
