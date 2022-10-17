import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() closeSidenav = new EventEmitter<void>();
  isAuth: boolean = false;
  authSub: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.authChange
      .subscribe(authStatus => {
        this.isAuth = authStatus;
      });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this.onClose();
    this.authService.logout();
  }
}
