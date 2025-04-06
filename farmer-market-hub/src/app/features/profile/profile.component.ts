import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { User } from '../../core/models/user.model';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styles: [`
    .profile-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .profile-header {
      display: flex;
      gap: 2rem;
      margin-bottom: 3rem;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .profile-avatar {
      position: relative;
      width: 150px;
      height: 150px;
    }

    .profile-avatar img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }

    .change-avatar {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .change-avatar:hover {
      background: rgba(0, 0, 0, 0.9);
    }

    .profile-info {
      flex: 1;
    }

    .profile-info h1 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }

    .email {
      color: #666;
      margin: 0 0 0.5rem 0;
    }

    .role {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: #e8f5e9;
      color: #2e7d32;
      border-radius: 20px;
      font-size: 0.875rem;
      margin: 0;
    }

    .profile-content {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 2rem;
    }

    .profile-nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .profile-nav a {
      padding: 0.75rem 1rem;
      color: #666;
      text-decoration: none;
      border-radius: 4px;
      transition: all 0.3s;
    }

    .profile-nav a:hover {
      background: #f8f9fa;
      color: #2c3e50;
    }

    .profile-nav a.active {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .profile-section {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .section-header h2 {
      margin: 0;
      color: #2c3e50;
    }

    .edit-button, .view-all {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
      transition: background-color 0.3s;
    }

    .edit-button {
      background-color: #3498db;
      color: white;
    }

    .edit-button:hover {
      background-color: #2980b9;
    }

    .view-all {
      background-color: #f8f9fa;
      color: #2c3e50;
    }

    .view-all:hover {
      background-color: #e9ecef;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .info-group label {
      display: block;
      color: #666;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }

    .info-group p {
      margin: 0;
      color: #2c3e50;
      font-size: 1rem;
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .order-card {
      border: 1px solid #eee;
      border-radius: 8px;
      padding: 1rem;
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #eee;
    }

    .order-id {
      color: #2c3e50;
      font-weight: 500;
    }

    .order-date {
      color: #666;
    }

    .order-items {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .order-item {
      display: flex;
      gap: 1rem;
    }

    .order-item img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 4px;
    }

    .item-details {
      flex: 1;
    }

    .item-details h4 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }

    .quantity {
      color: #666;
      margin: 0 0 0.5rem 0;
    }

    .price {
      color: #2ecc71;
      font-weight: bold;
      margin: 0;
    }

    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
      padding-top: 0.5rem;
      border-top: 1px solid #eee;
    }

    .order-status {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .order-status.pending {
      background-color: #fff3e0;
      color: #e65100;
    }

    .order-status.processing {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    .order-status.completed {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .order-status.cancelled {
      background-color: #ffebee;
      color: #c62828;
    }

    .order-total {
      font-weight: bold;
      color: #2c3e50;
    }

    .no-orders {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    .shop-now {
      display: inline-block;
      margin-top: 1rem;
      padding: 0.75rem 1.5rem;
      background-color: #2ecc71;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .shop-now:hover {
      background-color: #27ae60;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      width: 100%;
      max-width: 500px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .modal-content h2 {
      margin: 0 0 1.5rem 0;
      color: #2c3e50;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #666;
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .form-group textarea {
      resize: vertical;
    }

    .error {
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }

    .cancel-button,
    .save-button {
      padding: 0.8rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.3s;
    }

    .cancel-button {
      background-color: #95a5a6;
      color: white;
    }

    .cancel-button:hover {
      background-color: #7f8c8d;
    }

    .save-button {
      background-color: #2ecc71;
      color: white;
    }

    .save-button:hover:not(:disabled) {
      background-color: #27ae60;
    }

    .save-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  editingUser: User = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    role: 'customer',
    phone: '',
    address: '',
    avatarUrl: '',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  showEditModal: boolean = false;
  recentOrders: Order[] = [];

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadRecentOrders();
  }

  private loadUser(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  private loadRecentOrders(): void {
    if (this.user) {
      this.orderService.getUserOrders(this.user.id).subscribe(orders => {
        this.recentOrders = orders.slice(0, 5); // Show only the 5 most recent orders
      });
    }
  }

  editProfile(): void {
    if (this.user) {
      this.editingUser = { ...this.user };
      this.showEditModal = true;
    }
  }

  cancelEdit(): void {
    this.showEditModal = false;
    this.editingUser = {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      role: 'customer',
      phone: '',
      address: '',
      avatarUrl: '',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  saveProfile(form: any): void {
    if (!form.valid || !this.editingUser.id) return;

    this.authService.updateUser(this.editingUser.id, this.editingUser).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.cancelEdit();
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        // Handle error (show notification, etc.)
      }
    });
  }

  onChangeAvatar(): void {
    // Implement avatar change functionality
    console.log('Change avatar clicked');
  }
} 