import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const FarmerGuard = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isFarmer()) {
    router.navigate(['/']);
    return false;
  }

  return true;
};