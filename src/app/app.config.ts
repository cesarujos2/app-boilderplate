import { ApplicationConfig, provideZoneChangeDetection, inject, provideAppInitializer } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';

import { routes } from './app.routes';
import { RouteConfigService } from './core/routing/services/route-config.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    RouteConfigService,
    provideAppInitializer(() => {
      const routeConfigService = inject(RouteConfigService);
      routeConfigService.initialize();
    })
  ]
};
