import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AuthData } from '../models/auth-data';
import * as fromRoot from '../state/app.reducer';
import * as Auth from '../state/auth.actions';
import * as UI from '../state/ui.actions';
import { TrainingService } from './training.service';
import { UIService } from './ui.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private auth: AngularFireAuth, private trainingService: TrainingService, private uiService: UIService, private store: Store<{ ui: fromRoot.State }>) { }

  initAuthListener() {
    this.auth
      .authState
      .subscribe(user => {
        if (user) {
          this.store.dispatch(new Auth.SetAuthenticated());
          this.router.navigate(['/training']);
        }
        else {
          this.trainingService.cancelSubscriptions();
          this.store.dispatch(new Auth.SetUnauthenticated());
          this.router.navigate(['/login']);
        }
      });
  }

  register(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading);
    this.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        this.store.dispatch(new UI.StopLoading);
      })
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

        this.store.dispatch(new UI.StopLoading);
        this.uiService.showSnackBar(errorMessage, null, 3000);
        console.log(error);
      });
  }

  login(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading);
    this.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        this.store.dispatch(new UI.StopLoading);
      })
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

        this.store.dispatch(new UI.StopLoading);
        this.uiService.showSnackBar(errorMessage, null, 3000);
        console.log(error);
      });
  }

  logout() {
    this.auth.signOut();
  }
}
