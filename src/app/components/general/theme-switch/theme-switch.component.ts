import { Component, effect, inject, signal, DOCUMENT } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-theme-switch',
  imports: [MatIcon, MatIconButton],
  templateUrl: './theme-switch.component.html',
  styleUrl: './theme-switch.component.scss'
})
export class ThemeSwitchComponent {
  private document = inject(DOCUMENT);
  isDarkMode = signal(this.getInitialTheme());
  private initialized = signal(false);

  constructor() {
    effect(() => {
      const isDark = this.isDarkMode();
      const toggle = () => {
        this.document.body.classList.toggle('dark-mode', isDark);
        this.document.documentElement.classList.toggle('dark', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      };

      if (!this.initialized()) {
        toggle();
        this.initialized.set(true);
        return;
      }

      document.startViewTransition?.(toggle) ?? toggle();
    });
  }

  private getInitialTheme(): boolean {
    return localStorage.getItem('theme') === 'dark' ||
      (localStorage.getItem('theme') !== 'light' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
}
