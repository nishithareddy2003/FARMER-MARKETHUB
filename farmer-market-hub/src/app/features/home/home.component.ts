import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .hero {
      background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/assets/images/hero-bg.jpg');
      background-size: cover;
      background-position: center;
      height: 500px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: white;
      margin-bottom: 4rem;
    }

    .hero-content {
      max-width: 800px;
      padding: 2rem;
    }

    .hero h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .hero p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
    }

    .cta-button {
      display: inline-block;
      padding: 1rem 2rem;
      background-color: #2ecc71;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      transition: background-color 0.3s;
    }

    .cta-button:hover {
      background-color: #27ae60;
    }

    .featured-products {
      margin-bottom: 4rem;
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }

    .product-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s;
    }

    .product-card:hover {
      transform: translateY(-5px);
    }

    .product-card img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .product-info {
      padding: 1rem;
    }

    .product-info h3 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }

    .price {
      color: #2ecc71;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .farmer {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .product-card button {
      width: 100%;
      padding: 0.75rem;
      background-color: #2ecc71;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .product-card button:hover:not(:disabled) {
      background-color: #27ae60;
    }

    .product-card button:disabled {
      background-color: #95a5a6;
      cursor: not-allowed;
    }

    .categories {
      margin-bottom: 4rem;
    }

    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }

    .category-card {
      position: relative;
      height: 200px;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
    }

    .category-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    .category-card:hover img {
      transform: scale(1.1);
    }

    .category-card h3 {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1rem;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
      color: white;
      margin: 0;
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      text-align: center;
    }

    .feature {
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .feature i {
      font-size: 2.5rem;
      color: #2ecc71;
      margin-bottom: 1rem;
    }

    .feature h3 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .feature p {
      color: #666;
      line-height: 1.6;
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  categories: Category[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
    this.loadCategories();
  }

  private loadFeaturedProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.featuredProducts = products.filter(p => p.status === 'ACTIVE').slice(0, 6);
    });
  }

  private loadCategories(): void {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories.map(category => ({
        ...category,
        createdAt: new Date(),
        updatedAt: new Date(),
        severity: 'normal'
      }));
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
  }
} 