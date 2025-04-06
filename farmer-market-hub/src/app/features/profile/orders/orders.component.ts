import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="orders-container">
      <h2>My Orders</h2>
      <div *ngFor="let order of orders" class="order-card">
        <div class="order-header">
          <span>Order #{{order.id}}</span>
          <span class="status" [class]="order.status">{{order.status}}</span>
        </div>
        <div class="order-items">
          <div *ngFor="let item of order.items" class="order-item">
            <span>{{item.product.name}}</span>
            <span>{{item.quantity}} x {{item.product.price | currency}}</span>
          </div>
        </div>
        <div class="order-total">
          Total: {{order.total | currency}}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .orders-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    .order-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 1rem;
    }
    .order-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    .status {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
    }
    .status.pending { background: #f1c40f; color: white; }
    .status.processing { background: #3498db; color: white; }
    .status.shipped { background: #2ecc71; color: white; }
    .status.delivered { background: #27ae60; color: white; }
    .status.cancelled { background: #e74c3c; color: white; }
    .order-items {
      margin-bottom: 1rem;
    }
    .order-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    .order-total {
      text-align: right;
      font-weight: bold;
    }
  `]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: User | null) => {
      if (user?.id) {
        this.orderService.getUserOrders(user.id).subscribe(orders => {
          this.orders = orders;
        });
      }
    });
  }
} 