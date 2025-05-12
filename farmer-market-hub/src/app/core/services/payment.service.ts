import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PaymentDetails {
  amount: number;
  currency: string;
  paymentMethod: string;
  orderId: string;
}

export interface PaymentResponse {
  transactionId: string;
  status: 'success' | 'failed' | 'pending';
  message: string;
  orderId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  initiatePayment(paymentDetails: PaymentDetails): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/initiate`, paymentDetails);
  }

  verifyPayment(transactionId: string): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.apiUrl}/verify/${transactionId}`);
  }

  getPaymentStatus(orderId: string): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.apiUrl}/status/${orderId}`);
  }

  processRefund(orderId: string): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/refund/${orderId}`, {});
  }
}