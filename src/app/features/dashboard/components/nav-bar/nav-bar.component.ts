import { Component, inject } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { LogoComponent, ThemeSwitchComponent } from '@shared';
import { SidebarService } from '@core';

@Component({
  selector: 'app-nav-bar',
  imports: [
    ThemeSwitchComponent,
    MatToolbar, MatIcon, MatIconButton,
    UserAvatarComponent,
    LogoComponent
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  sidebarService = inject(SidebarService);
}
