import { Component, inject } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { ThemeSwitchComponent } from '@shared/components/theme-switch/theme-switch.component';
import { LogoComponent } from '@shared/components/logo/logo.component';
import { SidebarService } from '@core/services';
import { Router } from '@angular/router';
import { DASHBOARD_ROUTE_BRANCHES } from '../../pages/dashboard.routes';

@Component({
  selector: 'app-nav-bar',
  imports: [
    ThemeSwitchComponent,
    MatToolbar,
    UserAvatarComponent,
    LogoComponent
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  sideBarService = inject(SidebarService);
  private readonly router = inject(Router);

  goToDashboard(): void {
    this.router.navigate(DASHBOARD_ROUTE_BRANCHES.BASE.fullPath());
  }
}
