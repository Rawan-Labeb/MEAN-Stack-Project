import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OfflineOrder } from '../_models/offlineOrder.model';
import { Branch } from '../_models/branch.model';
import { SubInventory } from '../_models/sub-inventory.model';

@Injectable({
  providedIn: 'root'
})
export class OfflineOrderService {
  private apiUrl = 'http://localhost:5000/offlineOrder';

  constructor(private http: HttpClient) {}

  createOfflineOrder(order: OfflineOrder): Observable<any> {
    return this.http.post(`${this.apiUrl}/createOfflineOrder`, order);
  }

  getAllOfflineOrders(): Observable<OfflineOrder[]> {
    return this.http.get<OfflineOrder[]>(`${this.apiUrl}/getAllOfflineOrders`);
  }

  getOfflineOrderById(id: string): Observable<OfflineOrder> {
    return this.http.get<OfflineOrder>(`${this.apiUrl}/getOfflineOrderbyId/${id}`);
  }

  getOfflineOrdersByBranchId(branchId: string): Observable<OfflineOrder[]> {
    return this.http.get<OfflineOrder[]>(`${this.apiUrl}/getOfflineOrdersByBranchId/${branchId}`);
  }

  cancelOfflineOrder(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/cancelOfflineOrder/${id}`, {});
  }

  getBranchById(id: string): Observable<Branch> {
    return this.http.get<Branch>(`${this.apiUrl}/branch/getBranchById/${id}`);
  }

  getSubInventoryById(id: string): Observable<SubInventory> {
    return this.http.get<SubInventory>(`${this.apiUrl}/subInventory/getSubInventoryById/${id}`);
  }
  deleteProductFromOrder(orderId: string, productId: string, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/deleteProductFromOrder`, { orderId, productId, quantity });
  }
}