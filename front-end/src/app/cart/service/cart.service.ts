import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Product } from '../../seller-dashboard/models/product.model';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  public apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // إضافة منتج إلى السلة
  addToCart(userId: string, productId: string, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/add`, { userId, productId, quantity });
  }

  getCart(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/cart/${userId}`);
  }

  addOrder(data: any): Observable<{ status: number, message: string, data: { ErrorMsg: string, success: boolean, order: any } }> {
    return this.http.post<{ status: number, message: string, data: { ErrorMsg: string, success: boolean, order: any } }>(`${this.apiUrl}/orders`, data);
  }

  // تحديث كمية منتج في السلة
  updateCartItem(userId: string, productId: string, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/cart/${userId}`, { productId, quantity });
  }

  increaseQuantity(userId: string, productId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/cart/inc/${userId}/product/${productId}`, {});
  }

  // تقليل كمية منتج في السلة
  decreaseQuantity(userId: string, productId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/cart/dec/${userId}/product/${productId}`, {});
  }

  // حذف منتج من السلة
  removeFromCart(userId: string, productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cart/remove/${userId}/product/${productId}`).pipe(
      catchError(error => {
        console.error('There was an error!', error);
        return throwError(error);
      })
    );
  }

  // تفريغ السلة بالكامل
  clearCart(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cart/clear/${userId}`);
  }

// Get product details from cart by user id and product id
  getProductDetails(userId: string, productId: string): Observable<Product> {
  return this.http.get<Product>(`${this.apiUrl}/cart/${userId}/product-details/${productId}`);
}
checkout(userId: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/checkout`, { userId });
}

}



// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { BehaviorSubject, forkJoin, map } from 'rxjs';
// import { Observable } from 'rxjs/internal/Observable';
// import { Cart } from '../models/cart.model';
// import { ProductService } from '../../seller-dashboard/services/product.service';

// interface CartGuestProduct {
//   productId: string;
//   qty: number;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class CartService {
//   private apiUrl = 'http://localhost:5000';
//   private baseUrl = `${this.apiUrl}/api/customer/cart`;
//   private productNumSubject = new BehaviorSubject<number>(0);
//   productNum$ = this.productNumSubject.asObservable();

//   constructor(
//     private http: HttpClient,
//     private productService: ProductService
//   ) {}

//   // Example service method
//   getCart(userId: string): Observable<Cart> {
//     return this.http.get<{ status: number, message: string, data: { cart: any, ErrorMsg: string[] } }>(`${this.baseUrl}/${userId}`)
//       .pipe(
//         map(response => {
//           if (!response.data || !response.data.cart) {
//             throw new Error('Cart data is missing');
//           }
//           const cartData = response.data.cart;
//           return new Cart(
//             cartData._id,
//             cartData.cart_id,
//             cartData.product || [],
//             cartData.customer_id,
//             new Date(cartData.createdAt),
//             new Date(cartData.updatedAt),
//             cartData.Total
//           );
//         })
//       );
//   }

//   UpdateQty(data: any) {
//     return this.http.post<{ status: number, message: string, data: { ErrorMsg: string, success: boolean, newQty: number } }>(`${this.baseUrl}/changeQty`, data);
//   }

//   addProductToCart(data: any) {
//     return this.http.post<{ status: number, message: string, data: { ErrorMsg: string, success: boolean, newQty: number } }>(`${this.baseUrl}/AddProcuct`, data);
//   }

//   addOrder(data: any) {
//     return this.http.post<{ status: number, message: string, data: { ErrorMsg: string, success: boolean, order: any } }>(`${this.apiUrl}/api/customer/order`, data);
//   }

//   updateCartRegisteredCustomerProductNum(userId: string): void {
//     this.getCart(userId).subscribe(e => {
//       const count = e.product.length;
//       this.productNumSubject.next(count);
//     });
//   }

//   updateProductToCartGuest(data: any, type: 'more' | 'one') {
//     const cart = localStorage.getItem('cart');
//     let allCartProducts: CartGuestProduct[] = cart ? JSON.parse(cart) : [];
//     const existingProduct = allCartProducts.find(item => item.productId === data.productId);
//     if (!existingProduct && type === 'one') {
//       allCartProducts.push(data);
//     } else if (existingProduct && type === 'more') {
//       existingProduct.qty = data.qty;
//     } else if (!existingProduct && type === 'more') {
//       allCartProducts.push(data);
//     }
//     localStorage.setItem('cart', JSON.stringify(allCartProducts));
//     this.updateCartRegisteredCustomerProductNum(data.userId);
//   }

//   getCartGuest(): Observable<any[]> {
//     const cart = localStorage.getItem('cart');
//     if (!cart) {
//       return new Observable((observer) => observer.next([]));
//     }
//     let allCartProducts: CartGuestProduct[] = JSON.parse(cart);
//     const getProductDetailsRequests = allCartProducts.map(product => this.productService.getProductDetails(product.productId));
//     return forkJoin(getProductDetailsRequests).pipe(
//       map((products: any[]) => {
//         return allCartProducts.map((cartProduct, index) => {
//           return {
//             ...cartProduct,
//             productDetails: products[index].data
//           };
//         });
//       })
//     );
//   }
// }