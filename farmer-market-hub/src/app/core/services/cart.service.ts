import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { CartItem, Cart } from '../models/cart.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  
  cartItems$ = this.cartSubject.asObservable();
  cartItemCount$ = new BehaviorSubject<number>(0);
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart);
          this.cartSubject.next(cart);
          this.updateCartItemCount();
        } catch (error) {
          console.error('Error parsing saved cart:', error);
          localStorage.removeItem('cart');
          this.initializeEmptyCart();
        }
      } else {
        this.initializeEmptyCart();
      }
    }
  }

  private initializeEmptyCart(): Cart {
    const emptyCart: Cart = {
      id: 'temp-' + Date.now(),
      userId: 'anonymous',
      items: [],
      totalAmount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.cartSubject.next(emptyCart);
    this.updateCartItemCount();
    return emptyCart;
  }

  getCart(): Observable<Cart> {
    return new Observable<Cart>(observer => {
      this.cartItems$.subscribe(cart => {
        if (cart) {
          observer.next(cart);
        } else {
          const emptyCart = this.initializeEmptyCart();
          observer.next(emptyCart);
        }
      });
    });
  }

  addToCart(product: Product, quantity: number = 1): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    const currentCart = this.cartSubject.value || {
      id: 'temp-' + Date.now(),
      userId: 'anonymous',
      items: [],
      totalAmount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentItems = [...(currentCart.items || [])];
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.subtotal = existingItem.quantity * product.price;
    } else {
      const newItem: CartItem = {
        id: 'temp-' + Date.now(),
        product,
        quantity,
        subtotal: quantity * product.price
      };
      currentItems.push(newItem);
    }

    const updatedCart: Cart = {
      ...currentCart,
      items: currentItems,
      totalAmount: currentItems.reduce((total, item) => total + item.subtotal, 0),
      updatedAt: new Date()
    };

    this.cartSubject.next(updatedCart);
    this.updateCartItemCount();
    this.loadingSubject.next(false);
    
    if (this.isBrowser) {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  }

  removeFromCart(productId: string): void {
    const currentCart = this.cartSubject.value;
    if (!currentCart) return;

    const updatedItems = currentCart.items.filter(item => item.product.id !== productId);
    const updatedCart: Cart = {
      ...currentCart,
      items: updatedItems,
      totalAmount: updatedItems.reduce((total, item) => total + item.subtotal, 0),
      updatedAt: new Date()
    };

    this.cartSubject.next(updatedCart);
    this.updateCartItemCount();
    
    if (this.isBrowser) {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
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
      totalAmount: updatedItems.reduce((total, item) => total + item.subtotal, 0),
      updatedAt: new Date()
    };

    this.cartSubject.next(updatedCart);
    this.updateCartItemCount();
    
    if (this.isBrowser) {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  }

  clearCart(): Observable<Cart> {
    const emptyCart: Cart = {
      id: 'temp-' + Date.now(),
      userId: 'anonymous',
      items: [],
      totalAmount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.cartSubject.next(emptyCart);
    this.updateCartItemCount();
    
    if (this.isBrowser) {
      localStorage.removeItem('cart');
    }
    
    return of(emptyCart);
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