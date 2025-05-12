import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-list.component.html',
  styles: [`
    .product-list-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .search-box {
      flex: 1;
      min-width: 200px;
    }

    .search-input {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .category-filter,
    .sort-options {
      min-width: 200px;
    }

    select {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      background-color: white;
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
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

    h3 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }

    .price {
      color: #2ecc71;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .stock {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .low-stock {
      color: #e74c3c;
    }

    .category {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .add-to-cart {
      width: 100%;
      padding: 0.75rem;
      background-color: #2ecc71;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .add-to-cart:hover:not(:disabled) {
      background-color: #27ae60;
    }

    .add-to-cart:disabled {
      background-color: #95a5a6;
      cursor: not-allowed;
    }

    .no-products {
      text-align: center;
      padding: 2rem;
      color: #666;
      font-size: 1.1rem;
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  searchQuery: string = '';
  selectedCategory: string = '';
  sortBy: string = 'name';

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.categories = [...new Set(products.map(p => p.category))];
        this.filterProducts();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        // Handle error appropriately
      }
    });
  }

  filterProducts(): void {
    let filtered = this.products;
    
    if (this.searchQuery.trim()) {
      const searchLower = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }
    
    this.filteredProducts = filtered;
    this.sortProducts();
  }

  sortProducts(): void {
    const sortFunctions = {
      'price-asc': (a: Product, b: Product) => a.price - b.price,
      'price-desc': (a: Product, b: Product) => b.price - a.price,
      'name-asc': (a: Product, b: Product) => a.name.localeCompare(b.name),
      'name-desc': (a: Product, b: Product) => b.name.localeCompare(a.name)
    };

    const sortFn = sortFunctions[this.sortBy as keyof typeof sortFunctions];
    if (sortFn) {
      this.filteredProducts.sort(sortFn);
    }
  }

  addToCart(product: Product): void {
    if (product.stock > 0) {
      try {
        this.cartService.addToCart(product, 1);
      } catch (error) {
        console.error('Error adding product to cart:', error);
        // Handle error appropriately
      }
    }
  }
}