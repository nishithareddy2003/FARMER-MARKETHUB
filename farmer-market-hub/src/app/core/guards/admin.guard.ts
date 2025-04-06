import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isAdmin()) {
    router.navigate(['/']);
    return false;
  }

  return true;
}; 