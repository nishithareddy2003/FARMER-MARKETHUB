import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product = {
    id: '',
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
    updatedAt: new Date()
  };

  quantity: number = 1;
  selectedImage: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }
  }

  private loadProduct(id: string): void {
    this.productService.getProduct(id).subscribe(product => {
      this.product = product;
      this.selectedImage = product.imageUrl;
    });
  }

  selectImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  updateQuantity(newQuantity: number): void {
    if (newQuantity >= 1 && newQuantity <= this.product.stock) {
      this.quantity = newQuantity;
    }
  }

  addToCart(): void {
    if (this.product.stock > 0) {
      this.cartService.addToCart(this.product, this.quantity);
    }
  }
} 