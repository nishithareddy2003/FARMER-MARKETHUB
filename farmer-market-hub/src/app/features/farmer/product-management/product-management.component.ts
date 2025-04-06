import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/models/product.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-farmer-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-management.component.html',
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

    button.add-product {
      background-color: #2ecc71;
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.3s;
    }

    button.add-product:hover {
      background-color: #27ae60;
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
export class FarmerProductManagementComponent implements OnInit {
  currentUser: User | null = null;
  myProducts: Product[] = [];
  showEditModal = false;
  showAddModal = false;
  editingProduct: Product | null = null;

  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadProducts();
  }

  loadCurrentUser(): void {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.myProducts = products.filter(p => p.farmerId === this.currentUser?.id);
    });
  }

  editProduct(product: Product): void {
    this.editingProduct = { ...product };
    this.showEditModal = true;
    this.showAddModal = false;
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
    if (!form.valid) return;

    if (this.showAddModal) {
      if (!this.currentUser?.id) return;

      const newProduct: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
        name: this.editingProduct?.name || '',
        description: this.editingProduct?.description || '',
        price: this.editingProduct?.price || 0,
        category: this.editingProduct?.category || '',
        imageUrl: this.editingProduct?.imageUrl || '',
        images: this.editingProduct?.images || [],
        stock: this.editingProduct?.stock || 0,
        farmerId: this.currentUser.id,
        status: 'INACTIVE'
      };

      this.productService.createProduct(newProduct).subscribe({
        next: () => {
          this.loadProducts();
          this.cancelEdit();
          form.resetForm();
        },
        error: (error) => {
          console.error('Error creating product:', error);
          // TODO: Add error handling/notification
        }
      });
    } else {
      if (!this.editingProduct) return;

      this.productService.updateProduct(this.editingProduct.id, this.editingProduct).subscribe({
        next: () => {
          this.loadProducts();
          this.cancelEdit();
          form.resetForm();
        },
        error: (error) => {
          console.error('Error updating product:', error);
          // TODO: Add error handling/notification
        }
      });
    }
  }

  cancelEdit(): void {
    this.showEditModal = false;
    this.showAddModal = false;
    this.editingProduct = null;
  }

  toggleStatus(product: Product): void {
    const updatedProduct: Partial<Product> = { 
      status: product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' 
    };

    this.productService.updateProduct(product.id, updatedProduct).subscribe({
      next: () => {
        this.loadProducts();
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
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          // TODO: Add error handling/notification
        }
      });
    }
  }
} 