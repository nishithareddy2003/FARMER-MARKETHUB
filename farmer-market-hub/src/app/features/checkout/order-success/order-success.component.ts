import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="success-container">
      <div class="success-card">
        <div class="checkmark-circle">
          <div class="checkmark draw"></div>
        </div>
        <h2>Thank you for ordering!</h2>
        <p>Your order has been successfully placed.</p>
        <div class="action-buttons">
          <button class="btn-view-order" (click)="viewOrder()">VIEW ORDER</button>
          <button class="btn-continue" (click)="continueShopping()">CONTINUE SHOPPING</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .success-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f8f9fa;
      padding: 20px;
    }

    .success-card {
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
      max-width: 400px;
      width: 100%;
    }

    .checkmark-circle {
      width: 80px;
      height: 80px;
      position: relative;
      background: #ff6b35;
      border-radius: 50%;
      margin: 0 auto 20px;
      animation: scale 0.3s ease-in-out;
    }

    .checkmark {
      width: 40px;
      height: 24px;
      position: absolute;
      border-left: 4px solid white;
      border-bottom: 4px solid white;
      transform: rotate(-45deg);
      left: 17px;
      top: 22px;
    }

    .draw {
      animation: draw 0.6s ease-in-out forwards;
      animation-delay: 0.2s;
    }

    h2 {
      color: #333;
      margin: 0 0 10px;
      font-size: 24px;
    }

    p {
      color: #666;
      margin: 0 0 30px;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    button {
      padding: 12px 24px;
      border: none;
      border-radius: 5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-view-order {
      background: white;
      border: 2px solid #ff6b35;
      color: #ff6b35;
    }

    .btn-continue {
      background: #ff6b35;
      color: white;
    }

    .btn-view-order:hover {
      background: #fff1eb;
    }

    .btn-continue:hover {
      background: #ff5a1f;
    }

    @keyframes scale {
      0% { transform: scale(0); }
      100% { transform: scale(1); }
    }

    @keyframes draw {
      0% { width: 0; height: 0; }
      100% { width: 40px; height: 24px; }
    }
  `]
})
export class OrderSuccessComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  viewOrder() {
    this.router.navigate(['/profile/orders']);
  }

  continueShopping() {
    this.router.navigate(['/']);
  }
}