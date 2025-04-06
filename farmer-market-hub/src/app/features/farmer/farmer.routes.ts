import { Routes } from '@angular/router';

export const farmerRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./farmer-dashboard/farmer-dashboard.component').then(m => m.FarmerDashboardComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./product-management/product-management.component').then(m => m.FarmerProductManagementComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('./order-management/order-management.component').then(m => m.FarmerOrderManagementComponent)
  }
]; 