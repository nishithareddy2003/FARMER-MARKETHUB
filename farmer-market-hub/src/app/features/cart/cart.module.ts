import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CART_ROUTES } from './cart.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CART_ROUTES)
  ],
  exports: [RouterModule]
})
export class CartModule { }