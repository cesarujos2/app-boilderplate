import { Component } from '@angular/core';
import { LogoComponent } from '@shared/components/logo/logo.component';

@Component({
  selector: 'app-branding',
  imports: [LogoComponent],
  templateUrl: './branding.component.html',
  styleUrl: './branding.component.scss'
})
export class BrandingComponent {

}
