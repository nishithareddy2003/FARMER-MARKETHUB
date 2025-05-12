import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PRODUCTS_ROUTES } from './products.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PRODUCTS_ROUTES)
  ],
  exports: [RouterModule]
})
export class ProductsModule { }