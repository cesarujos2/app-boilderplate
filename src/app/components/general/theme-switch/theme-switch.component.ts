import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { ThemeService } from 'app/core/services/ui/theme.service';

@Component({
  selector: 'app-theme-switch',
  imports: [MatIcon, MatIconButton],
  templateUrl: './theme-switch.component.html',
  styleUrl: './theme-switch.component.scss'
})
export class ThemeSwitchComponent {
  readonly themeService = inject(ThemeService);
}
