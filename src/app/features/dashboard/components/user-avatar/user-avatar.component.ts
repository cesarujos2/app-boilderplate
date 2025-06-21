import { Component, computed, inject } from '@angular/core';
import { AccountService } from 'app/features/auth/services/account/account.service';
import { SentenceCasePipe } from 'app/shared/pipes/text-manipulation';

@Component({
  selector: 'app-user-avatar',
  imports: [
    SentenceCasePipe
  ],
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.scss'
})
export class UserAvatarComponent {
  readonly accountService = inject(AccountService);
  name = computed(() => this.accountService.user()?.name ?? '');
  rolName = computed(() => this.accountService.user()?.roles[0]);

  initials = computed(() => {
    return this.name()
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  })
}
