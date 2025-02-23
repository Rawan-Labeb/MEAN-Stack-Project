import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderDetailsComponent } from '../order-details/order-details.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  loading = false;
  error: string | null = null;
  statusFilter = 'all';

  readonly ORDER_STATUSES = ['pending', 'shipped', 'completed', 'cancelled', 'returned'];

  constructor(
    private orderService: OrderService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;

    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.applyFilters();
      },
      error: (error) => {
        this.error = typeof error === 'string' ? error : 'Failed to load orders';
        console.error('Error:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    if (this.statusFilter === 'all') {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === this.statusFilter);
    }
  }

  getStatusButtonClass(status: string): string {
    const classes = {
      pending: 'btn-warning',
      shipped: 'btn-info',
      completed: 'btn-success',
      cancelled: 'btn-danger',
      returned: 'btn-secondary'
    };
    return classes[status as keyof typeof classes] || 'btn-light';
  }

  changeOrderStatus(order: Order, newStatus: string): void {
    if (order.status === newStatus) return;

    Swal.fire({
      title: 'Change Order Status',
      text: `Are you sure you want to change the status to ${newStatus}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'No, cancel!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.changeOrderStatus(order._id, newStatus).subscribe({
          next: (updatedOrder) => {
            const index = this.orders.findIndex(o => o._id === order._id);
            if (index !== -1) {
              this.orders[index] = updatedOrder;
              this.applyFilters();
            }
            Swal.fire('Updated!', 'Order status has been updated.', 'success');
          },
          error: (error) => {
            console.error('Error updating status:', error);
            Swal.fire('Error!', 'Failed to update order status.', 'error');
          }
        });
      }
    });
  }

  viewDetails(order: Order): void {
    const modalRef = this.modalService.open(OrderDetailsComponent, {
      size: 'lg',
      centered: true
    });
    modalRef.componentInstance.order = order;
  }
}