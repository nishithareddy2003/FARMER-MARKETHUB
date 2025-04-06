import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';
import { User } from '../../../core/models/user.model';
import { Product } from '../../../core/models/product.model';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-farmer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <div class="welcome-section">
        <h1>Welcome, {{currentUser?.firstName}}!</h1>
        <p>Here's an overview of your farm's performance</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Products</h3>
          <p class="stat-value">{{totalProducts}}</p>
        </div>
        <div class="stat-card">
          <h3>Total Orders</h3>
          <p class="stat-value">{{totalOrders}}</p>
        </div>
        <div class="stat-card">
          <h3>Revenue</h3>
          <p class="stat-value">{{totalRevenue | currency}}</p>
        </div>
        <div class="stat-card">
          <h3>Pending Orders</h3>
          <p class="stat-value">{{pendingOrders}}</p>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="action-buttons">
          <button routerLink="/farmer/products" class="action-button">
            Manage Products
          </button>
          <button routerLink="/farmer/orders" class="action-button">
            View Orders
          </button>
        </div>
      </div>

      <div class="recent-activity">
        <h2>Recent Activity</h2>
        <div class="activity-list">
          <div *ngFor="let order of recentOrders" class="activity-item">
            <div class="activity-icon">
              <i class="fas fa-shopping-bag"></i>
            </div>
            <div class="activity-content">
              <h4>New Order #{{order.id}}</h4>
              <p>{{order.items.length}} items - {{order.totalAmount | currency}}</p>
              <p class="activity-time">{{order.createdAt | date:'medium'}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-section {
      margin-bottom: 2rem;
    }

    .welcome-section h1 {
      color: #2c3e50;
      margin: 0;
      font-size: 2rem;
    }

    .welcome-section p {
      color: #7f8c8d;
      margin: 0.5rem 0 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .stat-card h3 {
      color: #7f8c8d;
      margin: 0;
      font-size: 1rem;
      font-weight: 500;
    }

    .stat-value {
      color: #2c3e50;
      font-size: 2rem;
      font-weight: 600;
      margin: 0.5rem 0 0;
    }

    .quick-actions {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .quick-actions h2 {
      color: #2c3e50;
      margin: 0 0 1rem;
      font-size: 1.5rem;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
    }

    .action-button {
      padding: 0.8rem 1.5rem;
      border: none;
      border-radius: 4px;
      background-color: #3498db;
      color: white;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .action-button:hover {
      background-color: #2980b9;
    }

    .recent-activity {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .recent-activity h2 {
      color: #2c3e50;
      margin: 0 0 1rem;
      font-size: 1.5rem;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 4px;
      background-color: #f8f9fa;
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #3498db;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .activity-content {
      flex: 1;
    }

    .activity-content h4 {
      color: #2c3e50;
      margin: 0;
      font-size: 1rem;
    }

    .activity-content p {
      color: #7f8c8d;
      margin: 0.25rem 0 0;
      font-size: 0.9rem;
    }

    .activity-time {
      font-size: 0.8rem !important;
      color: #95a5a6 !important;
    }
  `]
})
export class FarmerDashboardComponent implements OnInit {
  currentUser: User | null = null;
  products: Product[] = [];
  orders: Order[] = [];
  pendingOrders: Order[] = [];
  totalProducts: number = 0;
  totalOrders: number = 0;
  totalRevenue: number = 0;
  recentOrders: Order[] = [];

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
      if (user) {
        this.loadProducts();
        this.loadOrders();
      }
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.totalProducts = products.filter((p: Product) => p.farmerId === this.currentUser?.id).length;
    });
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe((orders: Order[]) => {
      const farmerOrders = orders.filter((order: Order) =>
        order.items.some((item) => item.product.farmerId === this.currentUser?.id)
      );

      this.totalOrders = farmerOrders.length;
      this.pendingOrders = farmerOrders.filter((order: Order) => order.status === 'pending');

      this.totalRevenue = farmerOrders.reduce((total: number, order: Order) => {
        const farmerItems = order.items.filter((item) =>
          item.product.farmerId === this.currentUser?.id
        );
        return total + farmerItems.reduce((itemTotal: number, item) =>
          itemTotal + (item.price * item.quantity), 0);
      }, 0);

      this.recentOrders = [...farmerOrders]
        .sort((a: Order, b: Order) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5);
    });
  }
} 