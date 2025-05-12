import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderItem } from '../models/order.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  createOrder(orderData: {
    deliveryAddress: string;
    items: Array<{
      productId: string;
      quantity: number;
    }>;
  }): Observable<Order> {
    // Temporary mock implementation until backend is ready
    return new Observable<Order>(subscriber => {
      const mockItems: OrderItem[] = orderData.items.map(item => ({
        id: Math.random().toString(36).substr(2, 9),
        product: {
          id: item.productId,
          name: 'Mock Product',
          description: 'Mock Description',
          price: 10.00,
          category: 'Mock Category',
          imageUrl: 'mock-image.jpg',
          images: [],
          stock: 100,
          farmerId: 'mock-farmer-id',
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        quantity: item.quantity,
        price: 10.00,
        subtotal: 10.00 * item.quantity
      }));

      const mockOrder: Order = {
        id: Math.random().toString(36).substr(2, 9),
        userId: 'mock-user-id',
        customer: {
          id: 'mock-user-id',
          firstName: 'Mock',
          lastName: 'User',
          email: 'mock@example.com',
          role: 'customer',
          phone: '+1234567890',
          address: '123 Mock Street',
          avatarUrl: '/assets/default-avatar.png',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        items: mockItems,
        totalAmount: mockItems.reduce((sum, item) => sum + item.subtotal, 0),
        status: 'pending',
        paymentStatus: 'pending',
        deliveryAddress: orderData.deliveryAddress,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setTimeout(() => {
        subscriber.next(mockOrder);
        subscriber.complete();
      }, 1000); // Simulate network delay
    });
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  updateOrderStatus(id: string, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/status`, { status });
  }

  getUserOrders(userId: string): Observable<Order[]> {
    // TODO: Implement actual get user orders logic with backend
    return new Observable(subscriber => {
      subscriber.next([]);
      subscriber.complete();
    });
  }

  getFarmerOrders(farmerId: string): Observable<Order[]> {
    // TODO: Implement actual get farmer orders logic with backend
    return new Observable(subscriber => {
      subscriber.next([]);
      subscriber.complete();
    });
  }

  cancelOrder(id: string): Observable<Order> {
    return this.http.post<Order>(`/api/orders/${id}/cancel`, {});
  }

  getOrdersByStatus(status: string): Observable<Order[]> {
    return this.http.get<Order[]>(`/api/orders/status/${status}`);
  }
}