import { Component, computed, inject } from '@angular/core';
import { AccountService } from 'app/features/auth/services/account/account.service';
import { SentenceCasePipe } from 'app/shared/pipes/text-manipulation';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { NotificationService } from 'app/shared/services/ui/notification.service';
import { DASHBOARD_ROUTE_BRANCHES } from '../../pages/dashboard.routes';

@Component({
  selector: 'app-user-avatar',
  imports: [
    SentenceCasePipe,
    TitleCasePipe,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.scss'
})
export class UserAvatarComponent {
  readonly accountService = inject(AccountService);
  readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  
  name = computed(() => this.accountService.user()?.name ?? '');
  rolName = computed(() => this.accountService.user()?.roles[0]);
  user = computed(() => this.accountService.user());

  initials = computed(() => {
    return this.name()
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  });
  logout(): void {
    this.notificationService.showConfirmation(
      'Cerrar Sesión',
      '¿Está seguro que desea cerrar su sesión?'
    ).subscribe({
      next: (result) => {
        if (result.confirmed) {
          this.accountService.logout().subscribe({
            error: () => {
              this.accountService.forceLogout();
            }
          });
        }
      }
    });
  }

  goToAdmin(): void {
    this.router.navigate(DASHBOARD_ROUTE_BRANCHES.ADMIN.fullPath());
  }

  isAdmin(): boolean {
    return this.accountService.isAdmin();
  }
}
