import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from '../models/auth-data';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authChange = new Subject<boolean>();
  private user: User;

  constructor(private router: Router) { }

  register(authData: AuthData) {
    this.user = {
      userId: Math.round(Math.random() * 10000).toString(),
      email: authData.email
    };

    this.goToTraining();
  }

  login(authData: AuthData) {
    this.user = {
      userId: Math.round(Math.random() * 10000).toString(),
      email: authData.email
    };

    this.goToTraining();
  }

  logout() {
    this.user = null;
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }

  getUser() {
    return { ...this.user };
  }

  isAuth() {
    return this.user != null;
  }

  private goToTraining() {
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }
}
