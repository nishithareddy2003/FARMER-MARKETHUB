import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { FarmerGuard } from './core/guards/farmer.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./features/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: 'cart',
    loadChildren: () => import('./features/cart/cart.routes').then(m => m.CART_ROUTES)
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes),
    canActivate: [AuthGuard, adminGuard]
  },
  {
    path: 'farmer',
    loadChildren: () => import('./features/farmer/farmer.routes').then(m => m.farmerRoutes),
    canActivate: [AuthGuard, FarmerGuard]
  },
  {
    path: 'order-success',
    loadComponent: () => import('./features/order/order-success/order-success.component').then(m => m.OrderSuccessComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'checkout/success',
    loadComponent: () => import('./features/checkout/order-success/order-success.component').then(m => m.OrderSuccessComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
