import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt?: Date;
}

interface OrderItem {
  product: {
    _id: string;
    name: string;
  };
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  statusFilter: string = 'all';
  
  ngOnInit(): void {
    this.loadOrders();
  }
  
  loadOrders(): void {
    // Static data for demonstration
    this.orders = [
      {
        _id: 'ord001',
        orderNumber: 'ORD-5012',
        customerName: 'John Smith',
        items: [
          {
            product: {
              _id: '1',
              name: 'Chanel No. 5'
            },
            quantity: 1,
            price: 129.99
          },
          {
            product: {
              _id: '2',
              name: 'Dior Sauvage'
            },
            quantity: 1,
            price: 95.99
          }
        ],
        totalAmount: 225.98,
        status: 'delivered',
        createdAt: new Date(2023, 11, 15)
      },
      {
        _id: 'ord002',
        orderNumber: 'ORD-5011',
        customerName: 'Sarah Johnson',
        items: [
          {
            product: {
              _id: '3',
              name: 'Acqua di Gio'
            },
            quantity: 1,
            price: 85.50
          }
        ],
        totalAmount: 85.50,
        status: 'processing',
        createdAt: new Date(2023, 11, 14)
      },
      {
        _id: 'ord003',
        orderNumber: 'ORD-5010',
        customerName: 'Michael Brown',
        items: [
          {
            product: {
              _id: '4',
              name: 'Marc Jacobs Daisy'
            },
            quantity: 2,
            price: 78.99
          },
          {
            product: {
              _id: '5',
              name: 'Versace Eros'
            },
            quantity: 1,
            price: 90.99
          },
          {
            product: {
              _id: '1',
              name: 'Chanel No. 5'
            },
            quantity: 1,
            price: 129.99
          }
        ],
        totalAmount: 378.96,
        status: 'shipped',
        createdAt: new Date(2023, 11, 12)
      },
      {
        _id: 'ord004',
        orderNumber: 'ORD-5009',
        customerName: 'Emily Davis',
        items: [
          {
            product: {
              _id: '2',
              name: 'Dior Sauvage'
            },
            quantity: 1,
            price: 95.99
          }
        ],
        totalAmount: 95.99,
        status: 'pending',
        createdAt: new Date(2023, 11, 10)
      }
    ];
    
    this.applyFilters();
  }
  
  applyFilters(): void {
    if (this.statusFilter === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(
        order => order.status === this.statusFilter
      );
    }
  }
  
  updateStatus(orderId: string, newStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'): void {
    const order = this.orders.find(o => o._id === orderId);
    if (order) {
      order.status = newStatus;
      order.updatedAt = new Date();
      this.applyFilters();
    }
  }
}