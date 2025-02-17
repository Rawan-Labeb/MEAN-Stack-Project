import { Component, OnInit } from '@angular/core';
import { OrderService } from '../_services/order.service';
import { Order } from '../_models/order.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cachier',
  templateUrl: './cachier.component.html',
  styleUrls: ['./cachier.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CachierComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  orderNumbers: { [key: string]: number } = {}; // خاصية لتخزين الأرقام التسلسلية لكل طلب

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.orderService.getOrders().subscribe(
      (orders: Order[]) => {
        console.log('Fetched orders:', orders); // Add this line to check the data
        this.orders = orders;
        this.generateOrderNumbers();
        this.filterOrders();
      },
      (error: any) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  generateOrderNumbers(): void {
    this.orders.forEach((order, index) => {
      this.orderNumbers[order.orderId] = index + 1; // توليد الأرقام التسلسلية لكل طلب
    });
  }

  filterOrders(): void {
    this.filteredOrders = this.orders.filter(order => 
      order.status === 'pending' || order.status === 'completed' || order.status === 'cancelled' || order.status === 'returned'
    );
  }

  cancelOrder(orderId: number): void {
    this.orderService.deleteOrder(orderId).subscribe(
      () => {
        this.orders = this.orders.filter(order => order.orderId !== orderId);
        this.generateOrderNumbers();
        this.filterOrders();
        console.log('Order canceled:', orderId);
      },
      (error: any) => {
        console.error('Error canceling order:', error);
      }
    );
  }

  viewDetails(orderId: number): void {
    // Implement view details logic here
    console.log('View details for order:', orderId);
  }
}