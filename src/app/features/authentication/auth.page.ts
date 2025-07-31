import { Component, ElementRef, inject, viewChild } from '@angular/core';
import AuthLayoutComponent from '@features/authentication/layouts/auth-layout/auth-layout.component';
import { RouterOutlet } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { BrandingComponent } from '@features';
import { ThemeSwitchComponent } from '@shared';
import { NavigationService, ROUTE_KEYS } from '@core';

@Component({
  selector: 'auth-page',
  imports: [AuthLayoutComponent, RouterOutlet, BrandingComponent, ThemeSwitchComponent, MatButton],
  templateUrl: './auth.page.html',
  styleUrl: './auth.page.scss'
})
export default class AuthPage {
  secondSection = viewChild<ElementRef<HTMLElement>>('secondSection')
  navigationService = inject(NavigationService)

  toLoginPage() {
    this.navigationService.navigateToRoute(ROUTE_KEYS.AUTH_LOGIN);
    this.toSecondSection();
  }
  toRegisterPage() {
    this.navigationService.navigateToRoute(ROUTE_KEYS.AUTH_REGISTER);
    this.toSecondSection();
  }

  private toSecondSection() {
    if (this.secondSection()) {
      this.secondSection()?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}
