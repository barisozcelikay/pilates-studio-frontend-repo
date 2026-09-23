import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';

import { AuthService } from '../service/auth-service';

export const roleGuard: CanActivateChildFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data?.['roles'] as string[] | undefined;
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  const activeRole = authService.getActiveRole();
  if (activeRole && allowedRoles.includes(activeRole)) {
    return true;
  }

  return router.createUrlTree(['/unauthorized']);
};
