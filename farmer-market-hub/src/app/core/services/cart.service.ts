import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { CartItem, Cart } from '../models/cart.model';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cartItems$ = this.cartSubject.asObservable();
  cartItemCount$ = new BehaviorSubject<number>(0);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object, private http: HttpClient) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadCart();
  }

  private loadCart(): void {
    this.getCart().subscribe(cart => {
      this.cartSubject.next(cart);
      this.updateCartItemCount();
    });
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl);
  }

  addToCart(product: Product, quantity: number): void {
    const currentCart = this.cartSubject.value;
    if (!currentCart) {
      this.loadCart();
      return;
    }

    const currentItems = [...currentCart.items];
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.subtotal = existingItem.quantity * product.price;
    } else {
      const newItem: CartItem = {
        id: '', // Will be set by the backend
        product,
        quantity,
        subtotal: quantity * product.price
      };
      currentItems.push(newItem);
    }

    const updatedCart: Cart = {
      ...currentCart,
      items: currentItems,
      totalAmount: currentItems.reduce((total, item) => total + item.subtotal, 0)
    };

    this.cartSubject.next(updatedCart);
    this.http.put<Cart>(this.apiUrl, updatedCart).subscribe();
    this.updateCartItemCount();
  }

  removeFromCart(productId: string): void {
    const currentCart = this.cartSubject.value;
    if (!currentCart) return;

    const updatedItems = currentCart.items.filter(item => item.product.id !== productId);
    const updatedCart: Cart = {
      ...currentCart,
      items: updatedItems,
      totalAmount: updatedItems.reduce((total, item) => total + item.subtotal, 0)
    };

    this.cartSubject.next(updatedCart);
    this.http.put<Cart>(this.apiUrl, updatedCart).subscribe();
    this.updateCartItemCount();
  }

  updateQuantity(productId: string, quantity: number): void {
    const currentCart = this.cartSubject.value;
    if (!currentCart) return;

    const updatedItems = currentCart.items.map(item => {
      if (item.product.id === productId) {
        return {
          ...item,
          quantity,
          subtotal: quantity * item.product.price
        };
      }
      return item;
    });

    const updatedCart: Cart = {
      ...currentCart,
      items: updatedItems,
      totalAmount: updatedItems.reduce((total, item) => total + item.subtotal, 0)
    };

    this.cartSubject.next(updatedCart);
    this.http.put<Cart>(this.apiUrl, updatedCart).subscribe();
    this.updateCartItemCount();
  }

  clearCart(): void {
    const currentCart = this.cartSubject.value;
    if (!currentCart) return;

    const updatedCart: Cart = {
      ...currentCart,
      items: [],
      totalAmount: 0
    };

    this.cartSubject.next(updatedCart);
    this.http.put<Cart>(this.apiUrl, updatedCart).subscribe();
    this.updateCartItemCount();
  }

  private updateCartItemCount(): void {
    const currentCart = this.cartSubject.value;
    const count = currentCart?.items.reduce((total, item) => total + item.quantity, 0) || 0;
    this.cartItemCount$.next(count);
  }

  getCartItems(): CartItem[] {
    return this.cartSubject.value?.items || [];
  }

  getCartTotal(): number {
    return this.cartSubject.value?.totalAmount || 0;
  }
} 