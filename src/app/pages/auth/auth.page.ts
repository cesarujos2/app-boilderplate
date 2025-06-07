import { BrandingComponent } from '../../components/auth/branding/branding.component';
import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { AuthLayout } from "../../layouts/auth/auth.layout";
import { Router, RouterOutlet } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { ThemeSwitchComponent } from '../../components/general/theme-switch/theme-switch.component';
import { AUTH_ROUTE_BRANCHES } from './auth.routes';

@Component({
  selector: 'auth-page',
  imports: [AuthLayout, RouterOutlet, BrandingComponent, ThemeSwitchComponent, MatButton],
  templateUrl: './auth.page.html',
  styleUrl: './auth.page.scss'
})
export default class AuthPage {
  secondSection = viewChild<ElementRef<HTMLElement>>('secondSection')
  router = inject(Router)

  toLoginPage() {
    this.router.navigate(AUTH_ROUTE_BRANCHES.LOGIN.fullPath());
    this.toSecondSection();
  }
  toRegisterPage() {
    this.router.navigate(AUTH_ROUTE_BRANCHES.REGISTER.fullPath());
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
