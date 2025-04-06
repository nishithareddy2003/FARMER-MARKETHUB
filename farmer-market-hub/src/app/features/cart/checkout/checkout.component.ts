import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { CartItem } from '../../../core/models/cart-item.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="checkout-container">
      <h2>Checkout</h2>
      <div class="order-summary">
        <h3>Order Summary</h3>
        <div *ngFor="let item of cartItems" class="order-item">
          <span>{{item.product.name}}</span>
          <span>{{item.quantity}} x {{item.product.price | currency}}</span>
          <span>{{item.quantity * item.product.price | currency}}</span>
        </div>
        <div class="total">
          <strong>Total: {{totalAmount | currency}}</strong>
        </div>
      </div>

      <form (ngSubmit)="placeOrder()">
        <div class="form-group">
          <label>Delivery Address</label>
          <textarea [(ngModel)]="deliveryAddress" name="address" required></textarea>
        </div>

        <div class="form-group">
          <label>Payment Method</label>
          <select [(ngModel)]="paymentMethod" name="payment" required>
            <option value="credit">Credit Card</option>
            <option value="debit">Debit Card</option>
            <option value="upi">UPI</option>
          </select>
        </div>

        <button type="submit" [disabled]="isProcessing">
          {{isProcessing ? 'Processing...' : 'Place Order'}}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .checkout-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    .order-summary {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .order-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #dee2e6;
    }

    .total {
      margin-top: 1rem;
      text-align: right;
      font-size: 1.2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    textarea, select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    button {
      width: 100%;
      padding: 1rem;
      background: #2ecc71;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    button:hover:not(:disabled) {
      background: #27ae60;
    }

    button:disabled {
      background: #95a5a6;
      cursor: not-allowed;
    }
  `]
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  deliveryAddress: string = '';
  paymentMethod: string = 'credit';
  isProcessing: boolean = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  private loadCart(): void {
    this.cartService.getCart().subscribe(cart => {
      this.cartItems = cart.items;
      this.calculateTotal();
    });
  }

  private calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + (item.quantity * item.product.price),
      0
    );
  }

  placeOrder(): void {
    if (!this.deliveryAddress) return;

    this.isProcessing = true;
    const orderData = {
      deliveryAddress: this.deliveryAddress,
      items: this.cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };

    this.orderService.createOrder(orderData).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.router.navigate(['/profile/orders']);
      },
      error: (error) => {
        console.error('Error placing order:', error);
        this.isProcessing = false;
      }
    });
  }
} 