import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    // Sample products for demonstration
    const sampleProducts: Product[] = [
      {
        id: '1',
        name: 'Fresh Organic Tomatoes',
        description: 'Locally grown, pesticide-free organic tomatoes. Perfect for salads and cooking.',
        price: 4.99,
        category: 'Vegetables',
        imageUrl: 'https://images.unsplash.com/photo-1546470427-f5d8c4edf3e1?w=500&h=500&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1546470427-f5d8c4edf3e1?w=500&h=500&fit=crop',
          'https://images.unsplash.com/photo-1546470427-f5d8c4edf3e1?w=500&h=500&fit=crop'
        ],
        stock: 50,
        farmerId: 'farmer1',
        farmer: {
          id: 'farmer1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          role: 'farmer',
          phone: '123-456-7890',
          address: '123 Farm Road',
          avatarUrl: '',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Organic Carrots',
        description: 'Fresh, crunchy organic carrots. Great for juicing or cooking.',
        price: 3.99,
        category: 'Vegetables',
        imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&h=500&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&h=500&fit=crop',
          'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&h=500&fit=crop'
        ],
        stock: 75,
        farmerId: 'farmer2',
        farmer: {
          id: 'farmer2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          role: 'farmer',
          phone: '098-765-4321',
          address: '456 Farm Street',
          avatarUrl: '',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'Fresh Strawberries',
        description: 'Sweet and juicy strawberries. Perfect for desserts or snacking.',
        price: 6.99,
        category: 'Fruits',
        imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&h=500&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&h=500&fit=crop',
          'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&h=500&fit=crop'
        ],
        stock: 30,
        farmerId: 'farmer1',
        farmer: {
          id: 'farmer1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          role: 'farmer',
          phone: '123-456-7890',
          address: '123 Farm Road',
          avatarUrl: '',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '4',
        name: 'Organic Apples',
        description: 'Crisp and fresh organic apples. Available in various varieties.',
        price: 5.99,
        category: 'Fruits',
        imageUrl: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500&h=500&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500&h=500&fit=crop',
          'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500&h=500&fit=crop'
        ],
        stock: 100,
        farmerId: 'farmer2',
        farmer: {
          id: 'farmer2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          role: 'farmer',
          phone: '098-765-4321',
          address: '456 Farm Street',
          avatarUrl: '',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '5',
        name: 'Fresh Spinach',
        description: 'Organic baby spinach leaves. Perfect for salads and smoothies.',
        price: 4.49,
        category: 'Vegetables',
        imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&h=500&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&h=500&fit=crop',
          'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&h=500&fit=crop'
        ],
        stock: 40,
        farmerId: 'farmer1',
        farmer: {
          id: 'farmer1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          role: 'farmer',
          phone: '123-456-7890',
          address: '123 Farm Road',
          avatarUrl: '',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '6',
        name: 'Organic Bananas',
        description: 'Ripe and ready-to-eat organic bananas. Great source of potassium.',
        price: 3.49,
        category: 'Fruits',
        imageUrl: 'https://images.unsplash.com/photo-1543218024-57a70143c369?w=500&h=500&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1543218024-57a70143c369?w=500&h=500&fit=crop',
          'https://images.unsplash.com/photo-1543218024-57a70143c369?w=500&h=500&fit=crop'
        ],
        stock: 60,
        farmerId: 'farmer2',
        farmer: {
          id: 'farmer2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          role: 'farmer',
          phone: '098-765-4321',
          address: '456 Farm Street',
          avatarUrl: '',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '7',
        name: 'Fresh Bell Peppers',
        description: 'Colorful bell peppers in red, yellow, and green. Perfect for stir-fries.',
        price: 4.99,
        category: 'Vegetables',
        imageUrl: 'https://images.unsplash.com/photo-1526470498-9ae73c665de8?w=500&h=500&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1526470498-9ae73c665de8?w=500&h=500&fit=crop',
          'https://images.unsplash.com/photo-1526470498-9ae73c665de8?w=500&h=500&fit=crop'
        ],
        stock: 45,
        farmerId: 'farmer1',
        farmer: {
          id: 'farmer1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          role: 'farmer',
          phone: '123-456-7890',
          address: '123 Farm Road',
          avatarUrl: '',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '8',
        name: 'Organic Blueberries',
        description: 'Sweet and antioxidant-rich organic blueberries. Perfect for breakfast or desserts.',
        price: 7.99,
        category: 'Fruits',
        imageUrl: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=500&h=500&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=500&h=500&fit=crop',
          'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=500&h=500&fit=crop'
        ],
        stock: 25,
        farmerId: 'farmer2',
        farmer: {
          id: 'farmer2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          role: 'farmer',
          phone: '098-765-4321',
          address: '456 Farm Street',
          avatarUrl: '',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    return new Observable(subscriber => {
      subscriber.next(sampleProducts);
      subscriber.complete();
    });
  }

  getProduct(id: string): Observable<Product> {
    // Get the product from the sample products array
    return new Observable(subscriber => {
      this.getProducts().subscribe(products => {
        const product = products.find(p => p.id === id);
        if (product) {
          subscriber.next(product);
        } else {
          subscriber.next({
            id,
            name: '',
            description: '',
            price: 0,
            category: '',
            imageUrl: '',
            images: [],
            stock: 0,
            farmerId: '',
            farmer: {
              id: '',
              firstName: '',
              lastName: '',
              email: '',
              role: 'farmer',
              phone: '',
              address: '',
              avatarUrl: '',
              status: 'active',
              createdAt: new Date(),
              updatedAt: new Date()
            },
            status: 'ACTIVE',
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
        subscriber.complete();
      });
    });
  }

  createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Observable<Product> {
    // TODO: Implement actual create product logic with backend
    return new Observable(subscriber => {
      subscriber.next({
        id: '1',
        ...productData,
        farmer: {
          id: productData.farmerId,
          firstName: '',
          lastName: '',
          email: '',
          role: 'farmer',
          phone: '',
          address: '',
          avatarUrl: '',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        createdAt: new Date(),
        updatedAt: new Date()
      });
      subscriber.complete();
    });
  }

  updateProduct(id: string, productData: Partial<Product>): Observable<Product> {
    // TODO: Implement actual update product logic with backend
    return new Observable(subscriber => {
      subscriber.next({
        id,
        name: '',
        description: '',
        price: 0,
        category: '',
        imageUrl: '',
        images: [],
        stock: 0,
        farmerId: '',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...productData
      });
      subscriber.complete();
    });
  }

  deleteProduct(id: string): Observable<void> {
    // TODO: Implement actual delete product logic with backend
    return new Observable(subscriber => {
      subscriber.next();
      subscriber.complete();
    });
  }

  getCategories(): Observable<Category[]> {
    // TODO: Implement actual get categories logic with backend
    return new Observable(subscriber => {
      subscriber.next([]);
      subscriber.complete();
    });
  }

  createCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Observable<Category> {
    return this.http.post<Category>('/api/categories', category);
  }

  updateCategory(id: string, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`/api/categories/${id}`, category);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`/api/categories/${id}`);
  }
} 