import { DOCUMENT, inject, Injectable, signal } from '@angular/core';
import { STORAGE_KEYS, THEME_CONFIG } from '@core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private isDark = signal(this.isInitialDarkMode());
  readonly isDarkTheme = this.isDark.asReadonly();

  applyInitialTheme() {
    const isDark = this.isDark();
    this.applyThemeClasses(isDark);
  }

  toggleTheme() {
    this.isDark.update(v => !v);
    const isDark = this.isDark();
    localStorage.setItem(STORAGE_KEYS.THEME, isDark ? THEME_CONFIG.DARK : THEME_CONFIG.LIGHT);
    this.applyThemeClassesWithTransition(isDark);
  }

  private applyThemeClasses(isDark: boolean) {
    this.document.body.classList.toggle('dark-mode', isDark);
    this.document.documentElement.classList.toggle('dark', isDark);
    this.document.documentElement.classList.toggle('light', !isDark);
  }

  private applyThemeClassesWithTransition(isDark: boolean) {
    const apply = () => this.applyThemeClasses(isDark);
    this.document.startViewTransition?.(apply) ?? apply();
  }

  private isInitialDarkMode(): boolean {
    return (
      localStorage.getItem(STORAGE_KEYS.THEME) === THEME_CONFIG.DARK ||
      (localStorage.getItem(STORAGE_KEYS.THEME) !== THEME_CONFIG.LIGHT &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  }
}