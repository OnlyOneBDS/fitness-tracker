import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from '../models/auth-data';
import { TrainingService } from './training.service';
import { UIService } from './ui.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private router: Router, private auth: AngularFireAuth, private trainingService: TrainingService, private uiService: UIService) { }

  initAuthListener() {
    this.auth
      .authState
      .subscribe(user => {
        if (user) {
          this.isAuthenticated = true;
          this.authChange.next(true);
          this.router.navigate(['/training']);
        }
        else {
          this.trainingService.cancelSubscriptions();
          this.authChange.next(false);
          this.router.navigate(['/login']);
          this.isAuthenticated = false;
        }
      });
  }

  register(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => { this.uiService.loadingStateChanged.next(false); })
      .catch(error => {
        let errorCode = error.code;
        let errorMessage: string;

        switch (errorCode) {
          case 'auth/email-already-in-use':
            errorMessage = 'The email is already in use.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Email is invalid. Please try again.';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Email and password accounts are not enabled';
            break;
          case 'auth/weak-password':
            errorMessage = 'The password is too weak.';
            break;
          default:
            errorMessage = error.message;
            break;
        }

        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackBar(errorMessage, null, 3000);
        console.log(error);
      });
  }

  login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => { this.uiService.loadingStateChanged.next(false); })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage: string;

        switch (errorCode) {
          case 'auth/invalid-email':
          case 'auth/wrong-password':
            errorMessage = 'The email/password is invalid. Please check your credentials.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Access to this account has been disabled.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'User account with this email was not found.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Access to this account has been temporarily disabled due to many failed login attempts. Try again later.';
            break;
          default:
            errorMessage = error.message;
            break;
        }

        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackBar(errorMessage, null, 3000);
        console.log(error);
      });
  }

  logout() {
    this.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
