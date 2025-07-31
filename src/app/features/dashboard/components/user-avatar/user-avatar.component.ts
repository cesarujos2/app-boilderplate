import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-user-avatar',
  imports: [

  ],
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.scss'
})
export class UserAvatarComponent {
  name = input<string>("César Uriarte");
  imageUrl = input<string | null>(null);
  rolName = input<string | null>("Developer");

  initials = computed(() => {
    return this.name()
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  })
}
