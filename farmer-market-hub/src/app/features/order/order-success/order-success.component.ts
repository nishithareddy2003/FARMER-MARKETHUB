import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4 text-center">
      <div class="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
        <div class="text-green-600 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h2>
        
        <p class="text-gray-600 mb-6">
          Thank you for your purchase. We'll send you an email confirmation with order details shortly.
        </p>

        <div class="space-y-4">
          <a 
            routerLink="/" 
            class="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Continue Shopping
          </a>
          
          <a 
            routerLink="/orders" 
            class="block text-green-600 hover:text-green-700 transition-colors"
          >
            View Orders
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class OrderSuccessComponent {}