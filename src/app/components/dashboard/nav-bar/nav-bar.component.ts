import { Component, inject } from '@angular/core';
import { ThemeSwitchComponent } from '../../general/theme-switch/theme-switch.component';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { LogoComponent } from '@components/general/logo/logo.component';
import { SidebarService } from 'app/core/services/ui/side-bar.service';

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
  sideBarService = inject(SidebarService);
}
