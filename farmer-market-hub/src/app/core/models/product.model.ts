import { User } from './user.model';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  images: string[];
  stock: number;
  farmerId: string;
  farmer?: User;
  status: 'ACTIVE' | 'INACTIVE';
  rating?: number;
  ratingCount?: number;
  ratingDistribution?: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}