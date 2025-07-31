import { Component, inject, signal } from '@angular/core';
import DashboardLayoutComponent from '@features/dashboard/layouts/dashboard-layout/dashboard-layout.component';
import { NavBarComponent, FooterComponent } from '@features';
import { RouterOutlet } from '@angular/router';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { SidebarService, MediaQueryService } from '@core';

@Component({
  selector: 'app-dashboard',
  imports: [
    DashboardLayoutComponent,
    NavBarComponent,
    RouterOutlet,
    MatDrawerContainer,
    MatDrawer,
    MatDrawerContent,
    FooterComponent,
  ],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss'
})
export default class DashboardPage {
  sidebarService = inject(SidebarService);
  private mediaQuery = inject(MediaQueryService);

  isMd = this.mediaQuery.match('(max-width: 768px)');
}
