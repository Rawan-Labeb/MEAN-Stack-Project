import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {Order} from '../../../_models/order.module'
import {OrderService} from '../../../_services/order.service'
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, RouterModule, FormsModule,MatIconModule,MatMenuModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  orders: Order[] = [
    {
      orderId: 1,
      customerId: "12345",
      items: [
        { productId: "p1", price: 50, quantity: 2 },
        { productId: "p2", price: 30, quantity: 1 },
        { productId: "p2", price: 30, quantity: 1 },
        { productId: "p2", price: 30, quantity: 1 },
      ],
      totalPrice: 130,
      status: "Pending",
      paymentMethod: "Card",
      date: new Date(),
      customerDetails: {
        firstName: "John",
        lastName: "Doe",
        address: {
          street: "123 Main St",
          city: "New York",
          zipCode: "10001",
        },
        email: "john.doe@example.com",
        phone: "123-456-7890",
      },
    },
    {
      orderId: 1,
      customerId: "12345",
      items: [
        { productId: "p1", price: 50, quantity: 2 },
        { productId: "p2", price: 30, quantity: 1 },
        { productId: "p2", price: 30, quantity: 1 },
        { productId: "p2", price: 30, quantity: 1 },
        { productId: "p2", price: 30, quantity: 1 },
        { productId: "p2", price: 30, quantity: 1 },
        { productId: "p2", price: 30, quantity: 1 },
      ],
      totalPrice: 130,
      status: "Shipped",
      paymentMethod: "Card",
      date: new Date(),
      customerDetails: {
        firstName: "John",
        lastName: "Doe",
        address: {
          street: "123 Main St",
          city: "New York",
          zipCode: "10001",
        },
        email: "john.doe@example.com",
        phone: "123-456-7890",
      },
    },
    {
      orderId: 1,
      customerId: "12345",
      items: [
        { productId: "p1", price: 50, quantity: 2 },
        { productId: "p2", price: 30, quantity: 1 },
        { productId: "p2", price: 30, quantity: 1 },
      ],
      totalPrice: 130,
      status: "Completed",
      paymentMethod: "Cash",
      date: new Date(),
      customerDetails: {
        firstName: "John",
        lastName: "Doe",
        address: {
          street: "123 Main St",
          city: "New York",
          zipCode: "10001",
        },
        email: "john.doe@example.com",
        phone: "123-456-7890",
      },
    },
    {
      orderId: 1,
      customerId: "12345",
      items: [
        { productId: "p1", price: 50, quantity: 2 },
        { productId: "p2", price: 30, quantity: 1 },
        { productId: "p2", price: 30, quantity: 1 },
        { productId: "p2", price: 30, quantity: 1 },
        { productId: "p2", price: 30, quantity: 1 },
        { productId: "p2", price: 30, quantity: 1 },
        { productId: "p2", price: 30, quantity: 1 },
      ],
      totalPrice: 130,
      status: "Cancelled",
      paymentMethod: "Card",
      date: new Date(),
      customerDetails: {
        firstName: "John",
        lastName: "Doe",
        address: {
          street: "123 Main St",
          city: "New York",
          zipCode: "10001",
        },
        email: "john.doe@example.com",
        phone: "123-456-7890",
      },
    },
    {
      orderId: 1,
      customerId: "12345",
      items: [
        { productId: "p1", price: 50, quantity: 2 },
      ],
      totalPrice: 130,
      status: "Returned",
      paymentMethod: "Online",
      date: new Date(),
      customerDetails: {
        firstName: "John",
        lastName: "Doe",
        address: {
          street: "123 Main St",
          city: "New York",
          zipCode: "10001",
        },
        email: "john.doe@example.com",
        phone: "123-456-7890",
      },
    },
    {
      orderId: 1,
      customerId: "12345",
      items: [
        { productId: "p1", price: 50, quantity: 2 },
        { productId: "p2", price: 30, quantity: 1 },
        { productId: "p2", price: 30, quantity: 1 },
        { productId: "p2", price: 30, quantity: 1 },
      ],
      totalPrice: 130,
      status: "Pending",
      paymentMethod: "Cash",
      date: new Date(),
      customerDetails: {
        firstName: "John",
        lastName: "Doe",
        address: {
          street: "123 Main St",
          city: "New York",
          zipCode: "10001",
        },
        email: "john.doe@example.com",
        phone: "123-456-7890",
      },
    },
    {
      orderId: 2,
      customerId: "67890",
      items: [
        { productId: "p3", price: 25, quantity: 3 },
        { productId: "p4", price: 40, quantity: 1 },
      ],
      totalPrice: 115,
      status: "Completed",
      paymentMethod: "Online",
      date: new Date(),
      customerDetails: {
        firstName: "Jane",
        lastName: "Smith",
        address: {
          street: "456 Elm St",
          city: "Los Angeles",
          zipCode: "90001",
        },
        email: "jane.smith@example.com",
        phone: "987-654-3210",
      },
    },
  ];
      constructor(private OrderService: OrderService,private datePipe: DatePipe) {}
      filteredOrders: Order[] = [];
      loading = false;
      searchTerm: string = '';
      sortColumn: keyof Order = 'date';
      sortDirection: 'asc' | 'desc' = 'asc';
      statusFilter: 'all' | "Pending" | "Shipped" | "Completed" | "Cancelled" | "Returned"  = 'all';
    
      ngOnInit(): void {
        this.filteredOrders = [...this.orders]; 
    this.applyFilters();
      }
      formatDate(date: Date | null): string {
        return this.datePipe.transform(date, 'MMM dd yyyy') || '';
      }
    
      loadUsers(): void {
        this.loading = true;
        this.OrderService.getOrders().subscribe({
          next: (data: Order[]) => {
            this.orders = data;
            this.filteredOrders = [...data];
            this.applyFilters();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading Users:', error);
            this.loading = false;
          }
        });
      }
    
      deleteUser(id: number): void {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.OrderService.deleteOrder(id).subscribe({
              next: () => {
                this.loadUsers();
                Swal.fire('Deleted!', 'user has been deleted.', 'success');
              },
              error: (error) => {
                console.error('Error deleting Order:', error);
                Swal.fire('Error!', 'Failed to delete Order.', 'error');
              }
            });
          }
        });
      }
    
      applyFilters(): void {
  let filtered = [...this.orders];

  if (this.searchTerm) {
    filtered = filtered.filter(order => 
      order.date.toString().toLowerCase().includes(this.searchTerm.toLowerCase()) 
    );
  }

  if (this.statusFilter !== 'all') {
    filtered = filtered.filter(order => 
      order.status === this.statusFilter 
    );
  }

  filtered.sort((a, b) => {
    const direction = this.sortDirection === 'asc' ? 1 : -1;
    if (typeof a[this.sortColumn] === 'number') {
      return ((a[this.sortColumn] as number) - (b[this.sortColumn] as number)) * direction;
    }
    return String(a[this.sortColumn]).localeCompare(String(b[this.sortColumn])) * direction;
  });

  this.filteredOrders = filtered;
}

    
      onSearch(): void {
        this.applyFilters();
      }
    
      onStatusFilterChange(): void {
        this.applyFilters();
      }
    
      sort(column: keyof Order): void {
        if (this.sortColumn === column) {
          this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortColumn = column;
          this.sortDirection = 'asc';
        }
        this.applyFilters();
      }

      updateOrderStatus(order: any) {
        if (order.status === 'Pending') {
          order.status = 'Shipped';
        } else if (order.status === 'Shipped') {
          order.status = 'Completed';
        }
      }
      
      cancelOrder(order: any) {
        order.status = 'Cancelled';
      }
      
      returnOrder(order: any) {
        order.status = 'Returned';
      }
      

}
