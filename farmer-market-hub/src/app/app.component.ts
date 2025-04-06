import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { CartService } from './core/services/cart.service';
import { User } from './core/models/user.model';
import { LoadingComponent } from './shared/components/loading/loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, LoadingComponent],
  template: `
    <app-loading></app-loading>
    <div class="app-container">
      <header>
        <div class="logo">
          <a routerLink="/">
            <img src="assets/images/logo.png" alt="Farmer Market Hub">
            <span>Farmer Market Hub</span>
          </a>
        </div>

        <nav>
          <a routerLink="/products">Products</a>
          <a routerLink="/cart" class="cart-link">
            Cart
            <span class="cart-badge" *ngIf="cartItemCount$ | async as count">{{count}}</span>
          </a>
          <ng-container *ngIf="currentUser; else authLinks">
            <div class="user-menu">
              <button class="user-button">
                {{currentUser.firstName}}
                <i class="fas fa-chevron-down"></i>
              </button>
              <div class="dropdown-menu">
                <a routerLink="/profile">Profile</a>
                <a routerLink="/orders">Orders</a>
                <a *ngIf="isAdmin" routerLink="/admin">Admin Dashboard</a>
                <a *ngIf="currentUser.role === 'farmer'" routerLink="/farmer">Farmer Dashboard</a>
                <button (click)="logout()">Logout</button>
              </div>
            </div>
          </ng-container>
          <ng-template #authLinks>
            <a routerLink="/auth/login">Login</a>
            <a routerLink="/auth/register" class="register-button">Register</a>
          </ng-template>
        </nav>
      </header>

      <main>
        <router-outlet></router-outlet>
      </main>

      <footer>
        <div class="footer-content">
          <div class="footer-section">
            <h3>About Us</h3>
            <p>Farmer Market Hub connects local farmers with customers, promoting sustainable agriculture and supporting local communities.</p>
          </div>
          <div class="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a routerLink="/products">Products</a></li>
              <li><a routerLink="/farmers">Our Farmers</a></li>
              <li><a routerLink="/about">About Us</a></li>
              <li><a routerLink="/contact">Contact</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h3>Contact Us</h3>
            <p>Email: support&#64;farmermarkethub.com</p>
            <p>Phone: (555) 123-4567</p>
            <p>Address: 123 Market Street, Farmville, CA 12345</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 Farmer Market Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    header {
      background-color: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .logo a {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: #2c3e50;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .logo img {
      height: 40px;
      margin-right: 1rem;
    }

    nav {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    nav a {
      text-decoration: none;
      color: #2c3e50;
      font-weight: 500;
      transition: color 0.3s;
    }

    nav a:hover {
      color: #3498db;
    }

    .cart-link {
      position: relative;
    }

    .cart-badge {
      position: absolute;
      top: -8px;
      right: -12px;
      background-color: #e74c3c;
      color: white;
      font-size: 0.8rem;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      min-width: 20px;
      text-align: center;
    }

    .user-menu {
      position: relative;
    }

    .user-button {
      background: none;
      border: none;
      padding: 0.5rem;
      font-size: 1rem;
      color: #2c3e50;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      min-width: 200px;
      display: none;
    }

    .user-menu:hover .dropdown-menu {
      display: flex;
      flex-direction: column;
    }

    .dropdown-menu a,
    .dropdown-menu button {
      padding: 0.8rem 1rem;
      text-decoration: none;
      color: #2c3e50;
      border: none;
      background: none;
      text-align: left;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .dropdown-menu a:hover,
    .dropdown-menu button:hover {
      background-color: #f8f9fa;
    }

    .register-button {
      background-color: #3498db;
      color: white !important;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s !important;
    }

    .register-button:hover {
      background-color: #2980b9;
    }

    main {
      flex: 1;
      padding: 2rem;
      background-color: #f8f9fa;
    }

    footer {
      background-color: #2c3e50;
      color: white;
      padding: 3rem 2rem 1rem;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .footer-section h3 {
      color: #3498db;
      margin: 0 0 1rem;
    }

    .footer-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-section ul li {
      margin-bottom: 0.5rem;
    }

    .footer-section a {
      color: white;
      text-decoration: none;
      transition: color 0.3s;
    }

    .footer-section a:hover {
      color: #3498db;
    }

    .footer-bottom {
      text-align: center;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .footer-bottom p {
      margin: 0;
      color: #95a5a6;
    }
  `]
})
export class AppComponent implements OnInit {
  currentUser: User | null = null;
  cartItemCount$ = this.cartService.cartItemCount$;
  isAdmin: boolean = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = user?.role === 'admin';
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
