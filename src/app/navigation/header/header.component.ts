import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sidenavToggle = new EventEmitter<void>();
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

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }
}
