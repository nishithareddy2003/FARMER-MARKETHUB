import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/cart.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html',
  styles: [`
    .cart-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      position: relative;
    }

    .error-message {
      background-color: #fee2e2;
      border: 1px solid #ef4444;
      color: #dc2626;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .retry-btn {
      background-color: #dc2626;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .retry-btn:hover {
      background-color: #b91c1c;
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 {
      color: #2c3e50;
      margin: 0;
    }

    .cart-summary {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .item-count {
      color: #666;
      font-size: 1.1rem;
    }

    .total {
      font-size: 1.5rem;
      font-weight: bold;
      color: #2ecc71;
    }

    .empty-cart {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .empty-cart p {
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 1.5rem;
    }

    .continue-shopping {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background-color: #3498db;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .continue-shopping:hover {
      background-color: #2980b9;
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .cart-item {
      display: flex;
      gap: 1.5rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      align-items: center;
    }

    .item-image {
      width: 120px;
      height: 120px;
      border-radius: 4px;
      overflow: hidden;
      flex-shrink: 0;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-details {
      flex: 1;
    }

    .item-details h3 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }

    .item-price {
      color: #2ecc71;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .quantity-controls button {
      width: 30px;
      height: 30px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .quantity-controls button:hover:not(:disabled) {
      background-color: #f8f9fa;
    }

    .quantity-controls button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .quantity-controls span {
      min-width: 30px;
      text-align: center;
    }

    .subtotal {
      color: #666;
      margin: 0;
    }

    .remove-item {
      padding: 0.5rem 1rem;
      background-color: #e74c3c;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .remove-item:hover {
      background-color: #c0392b;
    }

    .cart-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 2rem;
    }

    .checkout-button {
      padding: 0.75rem 1.5rem;
      background-color: #2ecc71;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1.1rem;
      transition: background-color 0.3s;
    }

    .checkout-button:hover {
      background-color: #27ae60;
    }
  `]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  isProcessing: boolean = false;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private cartService: CartService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.subscribeToCartState();
  }

  private subscribeToCartState(): void {
    this.cartService.loading$.subscribe(
      loading => this.loading = loading
    );

    this.cartService.error$.subscribe(
      error => this.error = error
    );
  }

  loadCart(): void {
    this.cartService.cartItems$.subscribe(cart => {
      if (cart) {
        this.cartItems = cart.items;
        this.totalAmount = cart.totalAmount;
      }
    });
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity < 1 || newQuantity > 99) return;
    if (this.loading) return;
    
    this.cartService.updateQuantity(item.product.id, newQuantity);
  }

  removeFromCart(productId: string): void {
    if (this.loading) return;
    this.cartService.removeFromCart(productId);
  }

  proceedToCheckout(): void {
    if (this.loading || this.cartItems.length === 0) return;
    
    this.isProcessing = true;
    this.cartService.cartItems$.pipe(take(1)).subscribe({
      next: (cart) => {
        if (cart && cart.items.length > 0) {
          this.router.navigate(['/checkout']);
        } else {
          this.error = 'Your cart is empty';
        }
        this.isProcessing = false;
      },
      error: (error) => {
        this.error = 'Failed to proceed to checkout. Please try again.';
        this.isProcessing = false;
      }
    });
  }
}