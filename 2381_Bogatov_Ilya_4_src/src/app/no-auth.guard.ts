import {CanActivateFn} from '@angular/router';
import {Router} from '@angular/router';
import {inject} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

export const noAuthGuard: CanActivateFn = () => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  if (cookieService.check('_id')) {
    void router.navigate(['/feed']);
    return false;
  }
  return true;
};
