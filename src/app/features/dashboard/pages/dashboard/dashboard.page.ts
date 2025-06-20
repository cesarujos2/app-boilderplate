import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { SidebarService } from 'app/core/services/ui/side-bar.service';
import { MediaQueryService } from 'app/core/services/ui/media-query.service';
import { DashboardLayout } from '../../layouts/dashboard.layout';
import { NavBarComponent } from '@components/dashboard/nav-bar/nav-bar.component';
import { FooterComponent } from '@components/dashboard/footer/footer.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    DashboardLayout,
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
