import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderDetailsComponent } from '../order-details/order-details.component';
import Swal from 'sweetalert2';
import { AuthServiceService } from '../../../_services/auth-service.service';
import { CookieService } from 'ngx-cookie-service';
import { switchMap, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: Order[] = [];
  loading = false;
  error: string | null = null;
  statusFilter = 'all';

  readonly ORDER_STATUSES = ['pending', 'shipped', 'completed', 'cancelled', 'returned'];

  constructor(
    private orderService: OrderService,
    private modalService: NgbModal,
    private authService: AuthServiceService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.loadSellerOrders();
  }

  private loadSellerOrders(): void {
    this.loading = true;
    
    this.orderService.getSellerOrders().subscribe({
      next: (orders) => {
        console.log(`Received ${orders.length} orders for seller`);
        this.orders = orders;
        this.filteredOrders = orders;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load orders';
        console.error('Error loading orders:', error);
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

  getStatusBadgeClass(status: string): string {
    const classes = {
      pending: 'bg-warning',
      shipped: 'bg-info',
      completed: 'bg-success',
      cancelled: 'bg-danger',
      returned: 'bg-secondary'
    };
    return classes[status as keyof typeof classes] || 'bg-light';
  }

  viewDetails(order: Order): void {
    const modalRef = this.modalService.open(OrderDetailsComponent, {
      size: 'lg',
      centered: true
    });
    modalRef.componentInstance.order = order;
  }
}