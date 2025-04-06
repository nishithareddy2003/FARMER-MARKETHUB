import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { Cart,CartItem } from '../../core/models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styles: [`
    .cart-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
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
    }

    .item-image {
      width: 120px;
      height: 120px;
      border-radius: 4px;
      overflow: hidden;
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

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  private loadCart(): void {
    this.cartService.cartItems$.subscribe((value:Cart | null) => {
      let items:CartItem[]=[];
      if(value && value.items){
        const items: CartItem[]=value.items;
      }else{
        const items: CartItem[]=[];
      }
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  private calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + (item.product.price * item.quantity),
      0
    );
  }

  updateQuantity(item: CartItem, change: number): void {
    const newQuantity = item.quantity + change;
    if (newQuantity >= 1 && newQuantity <= item.product.stock) {
      this.cartService.updateQuantity(item.product.id, newQuantity);
    }
  }

  removeFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item.product.id);
  }
} 