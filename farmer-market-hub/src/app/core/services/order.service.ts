import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';
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
    return this.http.post<Order>(this.apiUrl, orderData);
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