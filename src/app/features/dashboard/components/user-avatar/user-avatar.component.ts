import { Component, computed, inject } from '@angular/core';
import { AccountService } from 'app/features/auth/services/account/account.service';
import { SentenceCasePipe } from 'app/shared/pipes/text-manipulation';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

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
    this.accountService.logout().subscribe({
      next: () => {
        // El logout se maneja automáticamente en el servicio
      },
      error: () => {
        // En caso de error, forzar logout local
        this.accountService.forceLogout();
      }
    });
  }
}
