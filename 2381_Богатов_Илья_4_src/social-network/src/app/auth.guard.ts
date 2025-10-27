import {CanActivateFn} from '@angular/router';
import {Router} from '@angular/router';
import {inject} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

export const authGuard: CanActivateFn = () => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  if (cookieService.check('_id')) {
    return true;
  }
  void router.navigate(['/login']);
  return false;
};
