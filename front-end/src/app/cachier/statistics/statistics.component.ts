// import { Component, OnInit } from '@angular/core';
// import { OrderService } from '../../_services/order.service';
// import { Order } from '../../_models/order.module';

// @Component({
//   selector: 'app-statistics',
//   templateUrl: './statistics.component.html',
//   styleUrls: ['./statistics.component.css']
// })
// export class StatisticsComponent implements OnInit {
//   orders: Order[] = [];
//   completedOrdersCount: number = 0;
//   cancelledOrdersCount: number = 0;

//   constructor(private orderService: OrderService) {}

//   ngOnInit(): void {
//     this.getOrders();
//   }

//   getOrders(): void {
//     this.orderService.getOrders().subscribe(
//       (orders: Order[]) => {
//         this.orders = orders;
//         this.calculateOrderStatistics();
//       },
//       (error: any) => {
//         console.error('Error fetching orders:', error);
//       }
//     );
//   }

//   calculateOrderStatistics(): void {
//     this.completedOrdersCount = this.orders.filter(order => order.status === 'completed').length;
//     this.cancelledOrdersCount = this.orders.filter(order => order.status === 'cancelled').length;
//   }
// }