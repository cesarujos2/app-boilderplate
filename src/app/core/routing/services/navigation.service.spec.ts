/**
 * Unit tests for navigation.service.ts
 * Tests NavigationService functionality with Router mocking
 */

import { TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { RouteMetadata } from '../interfaces';
import { NavigationService } from './navigation.service';
import { routeRegistry } from '../registry';

describe('NavigationService', () => {
  let service: NavigationService;
  let mockRouter: jasmine.SpyObj<Router>;
  let routerEventsSubject: Subject<any>;
  
  const mockRoutes: RouteMetadata[] = [
    {
      key: 'ROOT',
      path: '',
      label: 'Root'
    },
    {
      key: 'AUTH',
      path: 'auth',
      label: 'Authentication',
      parent: 'ROOT'
    },
    {
      key: 'AUTH_LOGIN',
      path: 'login',
      label: 'Login',
      parent: 'AUTH'
    },
    {
      key: 'DASHBOARD',
      path: 'dashboard',
      label: 'Dashboard',
      parent: 'ROOT',
      requiresAuth: true
    },
    {
      key: 'DASHBOARD_OVERVIEW',
      path: 'overview',
      label: 'Overview',
      parent: 'DASHBOARD',
      requiresAuth: true
    }
  ];

  beforeEach(() => {
    routerEventsSubject = new Subject();
    
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'], {
      events: routerEventsSubject.asObservable(),
      url: '/auth/login'
    });

    TestBed.configureTestingModule({
      providers: [
        NavigationService,
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(NavigationService);
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    // Clear and setup test routes
    (routeRegistry as any).routes.clear();
    (routeRegistry as any).nodeCache.clear();
    mockRoutes.forEach(route => routeRegistry.register(route));
  });

  afterEach(() => {
    routerEventsSubject.complete();
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize route tracking on construction', () => {
      // The service should have set up route tracking
      expect(service.getCurrentRoute()).toBeDefined();
    });

    it('should update current route on NavigationEnd events', () => {
      const navigationEndEvent = new NavigationEnd(1, '/auth/login', '/auth/login');
      
      routerEventsSubject.next(navigationEndEvent);
      
      const currentRoute = service.getCurrentRoute();
      expect(currentRoute?.metadata.key).toBe('AUTH_LOGIN');
    });
  });

  describe('navigateToRoute', () => {
    it('should navigate to existing route successfully', async () => {
      mockRouter.navigate.and.returnValue(Promise.resolve(true));
      
      const result = await service.navigateToRoute('AUTH_LOGIN');
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login'], {
        queryParams: undefined,
        fragment: undefined
      });
      expect(result).toBe(true);
    });

    it('should navigate with query params and fragment', async () => {
      mockRouter.navigate.and.returnValue(Promise.resolve(true));
      
      const extras = {
        queryParams: { returnUrl: '/dashboard' },
        fragment: 'section1'
      };
      
      await service.navigateToRoute('AUTH_LOGIN', extras);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login'], {
        queryParams: { returnUrl: '/dashboard' },
        fragment: 'section1'
      });
    });

    it('should return false and log warning for non-existing route', async () => {
      spyOn(console, 'warn');
      
      const result = await service.navigateToRoute('NON_EXISTING');
      
      expect(console.warn).toHaveBeenCalledWith("Route with key 'NON_EXISTING' not found");
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should handle router navigation failure', async () => {
      mockRouter.navigate.and.returnValue(Promise.resolve(false));
      
      const result = await service.navigateToRoute('AUTH_LOGIN');
      
      expect(result).toBe(false);
    });
  });

  describe('navigateToPath', () => {
    it('should navigate to path without parameters', async () => {
      mockRouter.navigate.and.returnValue(Promise.resolve(true));
      
      const result = await service.navigateToPath('/custom/path');
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/custom/path']);
      expect(result).toBe(true);
    });

    it('should navigate to path with parameters', async () => {
      mockRouter.navigate.and.returnValue(Promise.resolve(true));
      
      const params = { id: '123', type: 'user' };
      const result = await service.navigateToPath('/users/:id/:type', params);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/users/123/user']);
      expect(result).toBe(true);
    });

    it('should handle multiple parameter replacements', async () => {
      mockRouter.navigate.and.returnValue(Promise.resolve(true));
      
      const params = { userId: '456', postId: '789' };
      await service.navigateToPath('/users/:userId/posts/:postId', params);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/users/456/posts/789']);
    });
  });

  describe('history navigation', () => {
    it('should go back in history', () => {
      spyOn(window.history, 'back');
      
      service.goBack();
      
      expect(window.history.back).toHaveBeenCalled();
    });

    it('should go forward in history', () => {
      spyOn(window.history, 'forward');
      
      service.goForward();
      
      expect(window.history.forward).toHaveBeenCalled();
    });
  });

  describe('getCurrentRoute', () => {
    it('should return current route', () => {
      // Simulate navigation to login page
      const navigationEndEvent = new NavigationEnd(1, '/auth/login', '/auth/login');
      routerEventsSubject.next(navigationEndEvent);
      
      const currentRoute = service.getCurrentRoute();
      expect(currentRoute?.metadata.key).toBe('AUTH_LOGIN');
    });

    it('should return null when no current route', () => {
      // Simulate navigation to non-existing route
      const navigationEndEvent = new NavigationEnd(1, '/non/existing', '/non/existing');
      routerEventsSubject.next(navigationEndEvent);
      
      const currentRoute = service.getCurrentRoute();
      expect(currentRoute).toBeNull();
    });
  });

  describe('routeExists', () => {
    it('should return true for existing route', () => {
      expect(service.routeExists('AUTH_LOGIN')).toBe(true);
    });

    it('should return false for non-existing route', () => {
      expect(service.routeExists('NON_EXISTING')).toBe(false);
    });
  });

  describe('getRouteUrl', () => {
    it('should return URL for existing route', () => {
      const url = service.getRouteUrl('AUTH_LOGIN');
      expect(url).toBe('/auth/login');
    });

    it('should return null for non-existing route', () => {
      const url = service.getRouteUrl('NON_EXISTING');
      expect(url).toBeNull();
    });
  });

  describe('isCurrentRoute', () => {
    it('should return true when route matches current route', () => {
      // Set current route
      const navigationEndEvent = new NavigationEnd(1, '/auth/login', '/auth/login');
      routerEventsSubject.next(navigationEndEvent);
      
      expect(service.isCurrentRoute('AUTH_LOGIN')).toBe(true);
    });

    it('should return false when route does not match current route', () => {
      // Set current route
      const navigationEndEvent = new NavigationEnd(1, '/auth/login', '/auth/login');
      routerEventsSubject.next(navigationEndEvent);
      
      expect(service.isCurrentRoute('DASHBOARD')).toBe(false);
    });

    it('should return false when no current route', () => {
      // Manually set current route to null to simulate no current route
      (service as any).currentRoute.set(null);
      expect(service.isCurrentRoute('AUTH_LOGIN')).toBe(false);
    });
  });

  describe('isChildOfRoute', () => {
    it('should return true when current route is child of given route', () => {
      // Set current route to AUTH_LOGIN (child of AUTH)
      const navigationEndEvent = new NavigationEnd(1, '/auth/login', '/auth/login');
      routerEventsSubject.next(navigationEndEvent);
      
      expect(service.isChildOfRoute('AUTH')).toBe(true);
      expect(service.isChildOfRoute('ROOT')).toBe(true);
    });

    it('should return false when current route is not child of given route', () => {
      // Set current route to AUTH_LOGIN
      const navigationEndEvent = new NavigationEnd(1, '/auth/login', '/auth/login');
      routerEventsSubject.next(navigationEndEvent);
      
      expect(service.isChildOfRoute('DASHBOARD')).toBe(false);
    });

    it('should return false when no current route', () => {
      // Manually set current route to null to simulate no current route
      (service as any).currentRoute.set(null);
      expect(service.isChildOfRoute('AUTH')).toBe(false);
    });

    it('should handle deep nesting', () => {
      // Set current route to DASHBOARD_OVERVIEW (child of DASHBOARD, grandchild of ROOT)
      const navigationEndEvent = new NavigationEnd(1, '/dashboard/overview', '/dashboard/overview');
      routerEventsSubject.next(navigationEndEvent);
      
      expect(service.isChildOfRoute('DASHBOARD')).toBe(true);
      expect(service.isChildOfRoute('ROOT')).toBe(true);
      expect(service.isChildOfRoute('AUTH')).toBe(false);
    });
  });

  describe('getChildRoutes', () => {
    it('should return child routes for given parent', () => {
      const children = service.getChildRoutes('AUTH');
      
      expect(children.length).toBe(1);
      expect(children[0].metadata.key).toBe('AUTH_LOGIN');
    });

    it('should return empty array for route with no children', () => {
      const children = service.getChildRoutes('AUTH_LOGIN');
      
      expect(children).toEqual([]);
    });

    it('should return empty array for non-existing route', () => {
      const children = service.getChildRoutes('NON_EXISTING');
      
      expect(children).toEqual([]);
    });
  });

  describe('isNavigating$', () => {
    it('should emit false on NavigationEnd', (done) => {
      service.isNavigating$.subscribe(isNavigating => {
        expect(isNavigating).toBe(false);
        done();
      });
      
      const navigationEndEvent = new NavigationEnd(1, '/auth/login', '/auth/login');
      routerEventsSubject.next(navigationEndEvent);
    });

    it('should not emit on other router events', (done) => {
      let emitted = false;
      
      service.isNavigating$.subscribe(() => {
        emitted = true;
      });
      
      // Emit a non-NavigationEnd event
      routerEventsSubject.next({ id: 1, url: '/test' });
      
      setTimeout(() => {
        expect(emitted).toBe(false);
        done();
      }, 100);
    });
  });

  describe('URL parsing and route matching', () => {
    it('should handle URLs with query parameters', () => {
      const navigationEndEvent = new NavigationEnd(1, '/auth/login?returnUrl=/dashboard', '/auth/login?returnUrl=/dashboard');
      routerEventsSubject.next(navigationEndEvent);
      
      const currentRoute = service.getCurrentRoute();
      expect(currentRoute?.metadata.key).toBe('AUTH_LOGIN');
    });

    it('should handle URLs with fragments', () => {
      const navigationEndEvent = new NavigationEnd(1, '/auth/login#section1', '/auth/login#section1');
      routerEventsSubject.next(navigationEndEvent);
      
      const currentRoute = service.getCurrentRoute();
      expect(currentRoute?.metadata.key).toBe('AUTH_LOGIN');
    });

    it('should handle URLs with both query params and fragments', () => {
      const navigationEndEvent = new NavigationEnd(1, '/auth/login?returnUrl=/dashboard#section1', '/auth/login?returnUrl=/dashboard#section1');
      routerEventsSubject.next(navigationEndEvent);
      
      const currentRoute = service.getCurrentRoute();
      expect(currentRoute?.metadata.key).toBe('AUTH_LOGIN');
    });

    it('should handle root URL', () => {
      const navigationEndEvent = new NavigationEnd(1, '/', '/');
      routerEventsSubject.next(navigationEndEvent);
      
      const currentRoute = service.getCurrentRoute();
      expect(currentRoute?.metadata.key).toBe('ROOT');
    });
  });
});