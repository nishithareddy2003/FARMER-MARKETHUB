import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { HOME_ROUTES } from './home.routes';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(HOME_ROUTES)
  ],
  exports: [RouterModule]
})
export class HomeModule { }