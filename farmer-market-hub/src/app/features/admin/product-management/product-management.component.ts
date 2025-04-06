import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="product-management">
      <div class="header">
        <h1>Product Management</h1>
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (ngModelChange)="filterProducts()" 
            placeholder="Search products..."
          >
        </div>
      </div>

      <div class="product-list">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Farmer</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of filteredProducts">
              <td>{{product.name}}</td>
              <td>{{product.category}}</td>
              <td>{{product.price | currency}}</td>
              <td>{{product.stock}}</td>
              <td>{{product.farmer?.firstName || 'N/A'}} {{product.farmer?.lastName || ''}}</td>
              <td>
                <span [class]="'status ' + (product.status || 'INACTIVE').toLowerCase()">
                  {{product.status || 'INACTIVE'}}
                </span>
              </td>
              <td class="actions">
                <button (click)="editProduct(product)" class="edit">Edit</button>
                <button (click)="toggleStatus(product)" class="toggle">
                  {{product.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}}
                </button>
                <button (click)="deleteProduct(product.id)" class="delete">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="showEditModal" class="modal">
        <div class="modal-content">
          <h2>Edit Product</h2>
          <form #productForm="ngForm" (ngSubmit)="saveChanges(productForm)">
            <div class="form-group">
              <label for="name">Name</label>
              <input 
                type="text" 
                id="name" 
                [ngModel]="editingProduct?.name" 
                (ngModelChange)="updateEditingProduct('name', $event)"
                name="name" 
                required
                #name="ngModel"
              >
              <div *ngIf="name.invalid && (name.dirty || name.touched)" class="error">
                Name is required
              </div>
            </div>
            <div class="form-group">
              <label for="category">Category</label>
              <input 
                type="text" 
                id="category" 
                [ngModel]="editingProduct?.category" 
                (ngModelChange)="updateEditingProduct('category', $event)"
                name="category" 
                required
                #category="ngModel"
              >
              <div *ngIf="category.invalid && (category.dirty || category.touched)" class="error">
                Category is required
              </div>
            </div>
            <div class="form-group">
              <label for="price">Price</label>
              <input 
                type="number" 
                id="price" 
                [ngModel]="editingProduct?.price" 
                (ngModelChange)="updateEditingProduct('price', $event)"
                name="price" 
                required
                min="0"
                step="0.01"
                #price="ngModel"
              >
              <div *ngIf="price.invalid && (price.dirty || price.touched)" class="error">
                <div *ngIf="price.errors?.['required']">Price is required</div>
                <div *ngIf="price.errors?.['min']">Price must be greater than 0</div>
              </div>
            </div>
            <div class="form-group">
              <label for="stock">Stock</label>
              <input 
                type="number" 
                id="stock" 
                [ngModel]="editingProduct?.stock" 
                (ngModelChange)="updateEditingProduct('stock', $event)"
                name="stock" 
                required
                min="0"
                #stock="ngModel"
              >
              <div *ngIf="stock.invalid && (stock.dirty || stock.touched)" class="error">
                <div *ngIf="stock.errors?.['required']">Stock is required</div>
                <div *ngIf="stock.errors?.['min']">Stock must be greater than 0</div>
              </div>
            </div>
            <div class="form-group">
              <label for="description">Description</label>
              <textarea 
                id="description" 
                [ngModel]="editingProduct?.description" 
                (ngModelChange)="updateEditingProduct('description', $event)"
                name="description" 
                rows="4"
              ></textarea>
            </div>
            <div class="modal-actions">
              <button type="submit" class="save" [disabled]="!productForm.form.valid">Save</button>
              <button type="button" (click)="cancelEdit()" class="cancel">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-management {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 {
      margin: 0;
      color: #2c3e50;
    }

    .search-box input {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 300px;
      font-size: 1rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    th {
      background-color: #f8f9fa;
      color: #2c3e50;
      font-weight: 600;
    }

    .status {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .status.active {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .status.inactive {
      background-color: #ffebee;
      color: #c62828;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.3s;
    }

    button.edit {
      background-color: #3498db;
      color: white;
    }

    button.edit:hover {
      background-color: #2980b9;
    }

    button.toggle {
      background-color: #f39c12;
      color: white;
    }

    button.toggle:hover {
      background-color: #d68910;
    }

    button.delete {
      background-color: #e74c3c;
      color: white;
    }

    button.delete:hover {
      background-color: #c0392b;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      width: 500px;
      max-width: 90%;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #2c3e50;
      font-weight: 500;
    }

    input, textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    textarea {
      resize: vertical;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    button.save {
      background-color: #2ecc71;
      color: white;
    }

    button.save:hover {
      background-color: #27ae60;
    }

    button.cancel {
      background-color: #95a5a6;
      color: white;
    }

    button.cancel:hover {
      background-color: #7f8c8d;
    }

    .error {
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    input.ng-invalid.ng-touched,
    textarea.ng-invalid.ng-touched {
      border-color: #e74c3c;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery: string = '';
  showEditModal: boolean = false;
  editingProduct: Product | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filterProducts();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        // TODO: Add error handling/notification
      }
    });
  }

  filterProducts(): void {
    if (!this.searchQuery) {
      this.filteredProducts = this.products;
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredProducts = this.products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      (product.farmer?.firstName?.toLowerCase() || '').includes(query) ||
      (product.farmer?.lastName?.toLowerCase() || '').includes(query)
    );
  }

  editProduct(product: Product): void {
    this.editingProduct = { ...product };
    this.showEditModal = true;
  }

  updateEditingProduct(field: keyof Product, value: any): void {
    if (this.editingProduct) {
      this.editingProduct = {
        ...this.editingProduct,
        [field]: value
      };
    }
  }

  saveChanges(form: NgForm): void {
    if (!this.editingProduct || !form.valid) return;

    this.productService.updateProduct(this.editingProduct.id, this.editingProduct).subscribe({
      next: (updatedProduct) => {
        const index = this.products.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
          this.filterProducts();
        }
        this.showEditModal = false;
        this.editingProduct = null;
        form.resetForm();
      },
      error: (error) => {
        console.error('Error updating product:', error);
        // TODO: Add error handling/notification
      }
    });
  }

  cancelEdit(): void {
    this.showEditModal = false;
    this.editingProduct = null;
  }

  toggleStatus(product: Product): void {
    const updatedProduct: Partial<Product> = { 
      status: product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' 
    };

    this.productService.updateProduct(product.id, updatedProduct).subscribe({
      next: (result) => {
        const index = this.products.findIndex(p => p.id === result.id);
        if (index !== -1) {
          this.products[index] = result;
          this.filterProducts();
        }
      },
      error: (error) => {
        console.error('Error toggling product status:', error);
        // TODO: Add error handling/notification
      }
    });
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
          this.filterProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          // TODO: Add error handling/notification
        }
      });
    }
  }
} 