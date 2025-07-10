import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, linkedSignal, Signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDrawer, MatDrawerContainer, MatDrawerContent, MatDrawerMode } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ADMIN_ROUTE_BRANCHES } from './admin.routes';
import { MediaQueryService } from '@core/services';
import { AdminSideBarService } from './services/admin-side-bar.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatDrawerContainer, MatDrawer, MatDrawerContent,
    MatIcon, MatIconButton,
    CommonModule,
    RouterOutlet, RouterLink, RouterLinkActive,
  ],
  templateUrl: './admin.page.html',
  styleUrl: './admin.page.scss'
})
export default class AdminComponent {
  private readonly mediaQueryService = inject(MediaQueryService);
  private readonly adminSideBarService = inject(AdminSideBarService);
  
  isMd = this.mediaQueryService.match('(min-width: 768px)');
  sideBarMode: Signal<MatDrawerMode> = computed(() => this.isMd() ? 'side' : 'over');

  isSideBarOpen = linkedSignal<boolean>(() => this.adminSideBarService.isOpen());

  constructor() {
    effect(() => {
      if (this.isMd()) {
        this.adminSideBarService.open();
      } else {
        this.adminSideBarService.close();
      }
    });
  }

  sections = [
    {
      node: ADMIN_ROUTE_BRANCHES.TASKS,
      icon: 'task_alt'
    },
    {
      node: ADMIN_ROUTE_BRANCHES.LOGS,
      icon: 'history'
    }
  ]

  toggleSideBar() {
    this.adminSideBarService.toggle();
  }

}
