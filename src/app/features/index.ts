// Features exports - Barrel pattern for clean imports

// Authentication
export { default as LoginComponent } from './authentication/pages/login/login.component';
export { default as RegisterComponent } from './authentication/pages/register/register.component';
export { default as ForgotPasswordComponent } from './authentication/pages/forgot-password/forgot-password.component';
export { BrandingComponent } from './authentication/components/branding/branding.component';

// Dashboard
export { FooterComponent } from './dashboard/components/footer/footer.component';
export { NavBarComponent } from './dashboard/components/nav-bar/nav-bar.component';
export { UserAvatarComponent } from './dashboard/components/user-avatar/user-avatar.component';