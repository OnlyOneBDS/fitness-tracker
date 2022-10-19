import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanLoad, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(private authService: AuthService, private router: Router) { }

  canLoad(route: ActivatedRouteSnapshot) {
    if (this.authService.isAuth()) {
      return true;
    }
    else {
      this.router.navigate(['/login']);
    }
  }
}
