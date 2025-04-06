import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { Order } from '../../../core/models/order.model';
import { User } from '../../../core/models/user.model';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

@Component({
  selector: 'app-farmer-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="order-management">
      <div class="header">
        <h1>Orders</h1>
        <div class="filters">
          <select [(ngModel)]="statusFilter" (change)="filterOrders()">
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div class="order-list">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of filteredOrders">
              <td>{{order.id}}</td>
              <td>{{order.customer.firstName}} {{order.customer.lastName}}</td>
              <td>
                <ul class="items-list">
                  <li *ngFor="let item of getFarmerItems(order)">
                    {{item.product.name}} x {{item.quantity}}
                  </li>
                </ul>
              </td>
              <td>{{calculateFarmerTotal(order) | currency}}</td>
              <td>
                <span [class]="'status ' + order.status.toLowerCase()">
                  {{order.status}}
                </span>
              </td>
              <td>{{order.createdAt | date:'short'}}</td>
              <td class="actions">
                <button 
                  *ngIf="order.status === 'pending'"
                  (click)="updateOrderStatus(order.id, 'processing')" 
                  class="process"
                >
                  Process
                </button>
                <button 
                  *ngIf="order.status === 'processing'"
                  (click)="updateOrderStatus(order.id, 'shipped')" 
                  class="ship"
                >
                  Ship
                </button>
                <button 
                  *ngIf="order.status === 'shipped'"
                  (click)="updateOrderStatus(order.id, 'delivered')" 
                  class="deliver"
                >
                  Mark Delivered
                </button>
                <button 
                  *ngIf="['pending', 'processing'].includes(order.status)"
                  (click)="updateOrderStatus(order.id, 'cancelled')" 
                  class="cancel"
                >
                  Cancel
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .order-management {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 {
      margin: 0;
      color: #2c3e50;
    }

    .filters select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      min-width: 150px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    th {
      background-color: #f8f9fa;
      color: #2c3e50;
      font-weight: 600;
    }

    .items-list {
      list-style: none;
      padding: 0;
      margin: 0;
      font-size: 0.875rem;
    }

    .items-list li {
      margin-bottom: 0.25rem;
    }

    .status {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .status.pending {
      background-color: #fff3e0;
      color: #e65100;
    }

    .status.processing {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    .status.shipped {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .status.delivered {
      background-color: #e8f5e9;
      color: #1b5e20;
    }

    .status.cancelled {
      background-color: #ffebee;
      color: #c62828;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.3s;
    }

    button.process {
      background-color: #3498db;
      color: white;
    }

    button.process:hover {
      background-color: #2980b9;
    }

    button.ship {
      background-color: #f39c12;
      color: white;
    }

    button.ship:hover {
      background-color: #d68910;
    }

    button.deliver {
      background-color: #2ecc71;
      color: white;
    }

    button.deliver:hover {
      background-color: #27ae60;
    }

    button.cancel {
      background-color: #e74c3c;
      color: white;
    }

    button.cancel:hover {
      background-color: #c0392b;
    }
  `]
})
export class FarmerOrderManagementComponent implements OnInit {
  currentUser: User | null = null;
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  statusFilter: OrderStatus | 'all' = 'all';

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadOrders();
  }

  loadCurrentUser(): void {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
    });
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe((orders: Order[]) => {
      this.orders = orders.filter(order => 
        order.items.some(item => item.product.farmerId === this.currentUser?.id)
      );
      this.filterOrders();
    });
  }

  filterOrders(): void {
    if (this.statusFilter === 'all') {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(order => 
        order.status.toLowerCase() === this.statusFilter
      );
    }
  }

  getFarmerItems(order: Order): any[] {
    return order.items.filter(item => 
      item.product.farmerId === this.currentUser?.id
    );
  }

  calculateFarmerTotal(order: Order): number {
    return this.getFarmerItems(order).reduce((total, item) => 
      total + (item.price * item.quantity), 0
    );
  }

  updateOrderStatus(orderId: string, status: OrderStatus): void {
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        // TODO: Add error handling/notification
      }
    });
  }
} 