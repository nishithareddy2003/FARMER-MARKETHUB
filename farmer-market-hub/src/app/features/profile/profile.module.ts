import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { PROFILE_ROUTES } from './profile.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PROFILE_ROUTES)
  ],
  exports: [RouterModule]
})
export class ProfileModule { }