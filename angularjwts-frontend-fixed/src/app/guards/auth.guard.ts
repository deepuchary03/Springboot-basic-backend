import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigateByUrl('/login');
    return false;
  }

  const role = auth.getRole();
  const url = state.url;

  if (url.includes('admin') && role !== 'ADMIN') {
    alert('Access Denied: Admins only');
    router.navigateByUrl('/login');
    return false;
  }

  if (url.includes('user') && role !== 'USER') {
    alert('Access Denied: Users only');
    router.navigateByUrl('/login');
    return false;
  }

  return true;
};
