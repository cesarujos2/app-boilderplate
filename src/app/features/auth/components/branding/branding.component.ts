import { Component, inject } from '@angular/core';
import { LogoComponent } from '@shared/components/logo/logo.component';
import { AppInfoService } from '@core/services';

@Component({
  selector: 'app-branding',
  imports: [LogoComponent],
  templateUrl: './branding.component.html',
  styleUrl: './branding.component.scss'
})
export class BrandingComponent {
  private readonly appInfoService = inject(AppInfoService);

  // Propiedades públicas para el template
  readonly appName = this.appInfoService.getName();
  readonly appVersion = this.appInfoService.getVersion();
  readonly appDescription = this.appInfoService.getDescription();
  readonly appTitle = this.appInfoService.getTitle();
}
