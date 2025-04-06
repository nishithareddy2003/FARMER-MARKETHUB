import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="order-management">
      <div class="header">
        <h1>Order Management</h1>
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (ngModelChange)="filterOrders()" 
            placeholder="Search orders..."
          >
        </div>
      </div>

      <div class="order-list">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of filteredOrders">
              <td>#{{order.id}}</td>
              <td>{{order.customer.firstName}} {{order.customer.lastName}}</td>
              <td>{{order.total | currency}}</td>
              <td>
                <span [class]="'status ' + order.status.toLowerCase()">
                  {{order.status}}
                </span>
              </td>
              <td>{{order.createdAt | date:'medium'}}</td>
              <td class="actions">
                <button (click)="viewOrderDetails(order)" class="view">View</button>
                <button (click)="updateOrderStatus(order)" class="update">
                  Update Status
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="showDetailsModal && selectedOrder" class="modal">
        <div class="modal-content">
          <h2>Order Details</h2>
          <div class="order-info">
            <div class="info-group">
              <label>Order ID:</label>
              <span>#{{selectedOrder.id}}</span>
            </div>
            <div class="info-group">
              <label>Customer:</label>
              <span>{{selectedOrder.customer.firstName}} {{selectedOrder.customer.lastName}}</span>
            </div>
            <div class="info-group">
              <label>Email:</label>
              <span>{{selectedOrder.customer.email}}</span>
            </div>
            <div class="info-group">
              <label>Status:</label>
              <span [class]="'status ' + selectedOrder.status.toLowerCase()">
                {{selectedOrder.status}}
              </span>
            </div>
            <div class="info-group">
              <label>Date:</label>
              <span>{{selectedOrder.createdAt | date:'medium'}}</span>
            </div>
          </div>

          <div class="order-items">
            <h3>Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of selectedOrder.items">
                  <td>{{item.product.name}}</td>
                  <td>{{item.quantity}}</td>
                  <td>{{item.product.price | currency}}</td>
                  <td>{{item.quantity * item.product.price | currency}}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" class="total-label">Total</td>
                  <td class="total-value">{{selectedOrder.total | currency}}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div class="modal-actions">
            <button (click)="closeDetailsModal()" class="close">Close</button>
          </div>
        </div>
      </div>

      <div *ngIf="showStatusModal && selectedOrder" class="modal">
        <div class="modal-content">
          <h2>Update Order Status</h2>
          <div class="form-group">
            <label for="status">Status</label>
            <select 
              id="status" 
              [(ngModel)]="selectedStatus" 
              name="status"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div class="modal-actions">
            <button (click)="saveStatus()" class="save">Save</button>
            <button (click)="closeStatusModal()" class="cancel">Cancel</button>
          </div>
        </div>
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

    .search-box input {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 300px;
      font-size: 1rem;
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

    button.view {
      background-color: #3498db;
      color: white;
    }

    button.view:hover {
      background-color: #2980b9;
    }

    button.update {
      background-color: #f39c12;
      color: white;
    }

    button.update:hover {
      background-color: #d68910;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      width: 600px;
      max-width: 90%;
    }

    .order-info {
      margin: 1.5rem 0;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .info-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .info-group label {
      color: #7f8c8d;
      font-size: 0.875rem;
    }

    .info-group span {
      color: #2c3e50;
      font-weight: 500;
    }

    .order-items {
      margin-top: 2rem;
    }

    .order-items h3 {
      color: #2c3e50;
      margin: 0 0 1rem;
    }

    .total-label {
      text-align: right;
      font-weight: 600;
      color: #2c3e50;
    }

    .total-value {
      font-weight: 600;
      color: #2c3e50;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #2c3e50;
      font-weight: 500;
    }

    select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      background-color: white;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    button.save {
      background-color: #2ecc71;
      color: white;
    }

    button.save:hover {
      background-color: #27ae60;
    }

    button.cancel, button.close {
      background-color: #95a5a6;
      color: white;
    }

    button.cancel:hover, button.close:hover {
      background-color: #7f8c8d;
    }
  `]
})
export class OrderManagementComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  searchQuery: string = '';
  showDetailsModal: boolean = false;
  showStatusModal: boolean = false;
  selectedOrder: Order | null = null;
  selectedStatus: Order['status'] = 'pending';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (orders: Order[]) => {
        this.orders = orders;
        this.filterOrders();
      },
      error: (error: Error) => {
        console.error('Error loading orders:', error);
        // TODO: Add error handling/notification
      }
    });
  }

  filterOrders(): void {
    if (!this.searchQuery) {
      this.filteredOrders = this.orders;
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredOrders = this.orders.filter(order => 
      order.id.toLowerCase().includes(query) ||
      order.customer.firstName.toLowerCase().includes(query) ||
      order.customer.lastName.toLowerCase().includes(query) ||
      order.status.toLowerCase().includes(query)
    );
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedOrder = null;
  }

  updateOrderStatus(order: Order): void {
    this.selectedOrder = order;
    this.selectedStatus = order.status;
    this.showStatusModal = true;
  }

  saveStatus(): void {
    if (!this.selectedOrder || !this.selectedStatus) return;

    this.orderService.updateOrderStatus(this.selectedOrder.id, this.selectedStatus).subscribe({
      next: (result: Order) => {
        const index = this.orders.findIndex(o => o.id === result.id);
        if (index !== -1) {
          this.orders[index] = result;
          this.filterOrders();
        }
        this.closeStatusModal();
      },
      error: (error: Error) => {
        console.error('Error updating order status:', error);
        // TODO: Add error handling/notification
      }
    });
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
    this.selectedOrder = null;
    this.selectedStatus = 'pending';
  }
} 