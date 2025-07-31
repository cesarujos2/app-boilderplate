/**
 * Unit tests for route-config.service.ts
 * Tests RouteConfigService functionality, initialization, and validation
 */

import { TestBed } from '@angular/core/testing';
import { RouteConfigService } from './route-config.service';
import { ROUTE_KEYS } from '../definitions';
import { RouteMetadata } from '../interfaces';
import { routeRegistry } from '../registry';
import * as routeDefinitions from '../definitions';

describe('RouteConfigService', () => {
  let service: RouteConfigService;
  
  const mockValidRoutes: RouteMetadata[] = [
    {
      key: ROUTE_KEYS.ROOT,
      path: '',
      label: 'Root'
    },
    {
      key: ROUTE_KEYS.AUTH,
      path: 'auth',
      label: 'Authentication',
      parent: ROUTE_KEYS.ROOT
    },
    {
      key: ROUTE_KEYS.AUTH_LOGIN,
      path: 'login',
      label: 'Login',
      parent: ROUTE_KEYS.AUTH
    },
    {
      key: ROUTE_KEYS.DASHBOARD,
      path: 'dashboard',
      label: 'Dashboard',
      parent: ROUTE_KEYS.ROOT,
      requiresAuth: true
    },
    {
      key: ROUTE_KEYS.NOT_FOUND,
      path: '404',
      label: 'Not Found',
      parent: ROUTE_KEYS.ROOT
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RouteConfigService]
    });
    
    service = TestBed.inject(RouteConfigService);
    
    // Reset service state
    service.reset();
  });
  
  beforeEach(() => {
    // Clear registry before each test (but after TestBed setup)
    (routeRegistry as any).routes.clear();
    (routeRegistry as any).nodeCache.clear();
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should start as not initialized', () => {
      expect(service.isInitialized()).toBe(false);
    });
  });

  describe('initialize', () => {
    it('should initialize successfully with valid routes', () => {
      spyOn(console, 'log');
      
      // Mock initializeRoutes to register our test routes
      mockValidRoutes.forEach(route => routeRegistry.register(route));
      
      expect(() => service.initialize()).not.toThrow();
      expect(service.isInitialized()).toBe(true);
      expect(console.log).toHaveBeenCalledWith('Route system initialized successfully');
    });

    it('should warn when already initialized', () => {
      spyOn(console, 'warn');
      spyOn(console, 'log');
      
      // Mock routes
      mockValidRoutes.forEach(route => routeRegistry.register(route));
      
      service.initialize();
      service.initialize(); // Second call
      
      expect(console.warn).toHaveBeenCalledWith('Route system already initialized');
      expect(console.log).toHaveBeenCalledTimes(1); // Only called once
    });

    it('should throw error and log when validation fails', () => {
      spyOn(console, 'error');
      
      // Register incomplete routes (missing required routes)
      routeRegistry.register({
        key: 'INCOMPLETE',
        path: 'incomplete',
        label: 'Incomplete'
      });
      
      // Spy on validateRoutes to make it throw an error
      spyOn(service as any, 'validateRoutes').and.throwError('Validation failed');
      
      expect(() => service.initialize()).toThrow();
      expect(service.isInitialized()).toBe(false);
      expect(console.error).toHaveBeenCalledWith('Failed to initialize route system:', jasmine.any(Error));
    });
  });

  describe('isInitialized', () => {
    it('should return false before initialization', () => {
      expect(service.isInitialized()).toBe(false);
    });

    it('should return true after successful initialization', () => {
      mockValidRoutes.forEach(route => routeRegistry.register(route));
      service.initialize();
      
      expect(service.isInitialized()).toBe(true);
    });

    it('should return false after failed initialization', () => {
      // Register incomplete routes (missing required routes)
      routeRegistry.register({
        key: 'INCOMPLETE',
        path: 'incomplete',
        label: 'Incomplete'
      });
      
      // Spy on validateRoutes to make it throw an error
      spyOn(service as any, 'validateRoutes').and.throwError('Validation failed');
      
      try {
        service.initialize();
      } catch (error) {
        // Expected to throw
      }
      
      expect(service.isInitialized()).toBe(false);
    });
  });

  describe('getConfigSummary', () => {
    beforeEach(() => {
      const testRoutes: RouteMetadata[] = [
        {
          key: 'PUBLIC_1',
          path: 'public1',
          label: 'Public 1'
        },
        {
          key: 'PUBLIC_2',
          path: 'public2',
          label: 'Public 2'
        },
        {
          key: 'AUTH_REQUIRED_1',
          path: 'auth1',
          label: 'Auth Required 1',
          requiresAuth: true
        },
        {
          key: 'AUTH_REQUIRED_2',
          path: 'auth2',
          label: 'Auth Required 2',
          requiresAuth: true
        },
        {
          key: 'NOT_FOUND_ERROR',
          path: '404',
          label: 'Not Found'
        },
        {
          key: 'UNAUTHORIZED_ERROR',
          path: '401',
          label: 'Unauthorized'
        }
      ];
      
      testRoutes.forEach(route => routeRegistry.register(route));
    });

    it('should return correct summary counts', () => {
      const summary = service.getConfigSummary();
      
      expect(summary.totalRoutes).toBe(6);
      expect(summary.authRoutes).toBe(2);
      expect(summary.publicRoutes).toBe(4);
      expect(summary.errorRoutes).toBe(2);
    });

    it('should handle empty registry', () => {
      (routeRegistry as any).routes.clear();
      
      const summary = service.getConfigSummary();
      
      expect(summary.totalRoutes).toBe(0);
      expect(summary.authRoutes).toBe(0);
      expect(summary.publicRoutes).toBe(0);
      expect(summary.errorRoutes).toBe(0);
    });

    it('should count error routes correctly', () => {
      (routeRegistry as any).routes.clear();
      
      const errorRoutes: RouteMetadata[] = [
        { key: 'SERVER_ERROR', path: '500', label: 'Server Error' },
        { key: 'NOT_FOUND', path: '404', label: 'Not Found' },
        { key: 'UNAUTHORIZED', path: '401', label: 'Unauthorized' },
        { key: 'CUSTOM_ERROR', path: 'custom-error', label: 'Custom Error' }
      ];
      
      errorRoutes.forEach(route => routeRegistry.register(route));
      
      const summary = service.getConfigSummary();
      expect(summary.errorRoutes).toBe(3); // Only routes with ERROR, NOT_FOUND, or UNAUTHORIZED in key
    });
  });

  describe('validateRoutes', () => {
    it('should pass validation with all required routes', () => {
      mockValidRoutes.forEach(route => routeRegistry.register(route));
      
      expect(() => service.validateRoutes()).not.toThrow();
    });

    it('should throw error when required routes are missing', () => {
      // Register only some routes, missing required ones
      routeRegistry.register({
        key: 'SOME_ROUTE',
        path: 'some',
        label: 'Some Route'
      });
      
      expect(() => service.validateRoutes()).toThrow();
    });

    it('should throw error for orphaned routes', () => {
      // Register required routes first
      mockValidRoutes.forEach(route => routeRegistry.register(route));
      
      // Add orphaned route
      routeRegistry.register({
        key: 'ORPHANED',
        path: 'orphaned',
        label: 'Orphaned Route',
        parent: 'NON_EXISTING_PARENT'
      });
      
      expect(() => service.validateRoutes()).toThrow();
    });

    it('should throw error for duplicate paths at same level', () => {
      // Register required routes
      mockValidRoutes.forEach(route => routeRegistry.register(route));
      
      // Add duplicate path at same level
      routeRegistry.register({
        key: 'DUPLICATE_PATH',
        path: 'login', // Same as AUTH_LOGIN
        label: 'Duplicate Login',
        parent: ROUTE_KEYS.AUTH
      });
      
      expect(() => service.validateRoutes()).toThrow();
    });

    it('should allow same path at different levels', () => {
      mockValidRoutes.forEach(route => routeRegistry.register(route));
      
      // Add route with same path but different parent
      routeRegistry.register({
        key: 'DASHBOARD_LOGIN',
        path: 'login', // Same path as AUTH_LOGIN but different parent
        label: 'Dashboard Login',
        parent: ROUTE_KEYS.DASHBOARD
      });
      
      expect(() => service.validateRoutes()).not.toThrow();
    });

    it('should provide detailed error messages', () => {
      // Test missing required route error
      routeRegistry.register({
        key: 'SOME_ROUTE',
        path: 'some',
        label: 'Some Route'
      });
      
      try {
        service.validateRoutes();
        fail('Expected validation to throw');
      } catch (error: any) {
        expect(error.message).toContain('Route validation failed');
        expect(error.message).toContain('Required route');
        expect(error.message).toContain('is missing');
      }
    });
  });

  describe('getRouteTree', () => {
    beforeEach(() => {
      mockValidRoutes.forEach(route => routeRegistry.register(route));
    });

    it('should return route tree for root routes', () => {
      const tree = service.getRouteTree();
      
      expect(tree).toBeDefined();
      expect(tree.length).toBeGreaterThan(0);
      
      const rootItem = tree.find(item => item.key === ROUTE_KEYS.ROOT);
      expect(rootItem).toBeDefined();
      expect(rootItem!.children.length).toBeGreaterThan(0);
    });

    it('should build tree items with correct structure', () => {
      const tree = service.getRouteTree();
      const rootItem = tree.find(item => item.key === ROUTE_KEYS.ROOT)!;
      
      expect(rootItem).toEqual({
        key: ROUTE_KEYS.ROOT,
        path: '',
        label: 'Root',
        fullPath: '/',
        requiresAuth: false,
        children: jasmine.any(Array)
      });
    });

    it('should include nested children in tree', () => {
      const tree = service.getRouteTree();
      const rootItem = tree.find(item => item.key === ROUTE_KEYS.ROOT)!;
      const authItem = rootItem.children.find(child => child.key === ROUTE_KEYS.AUTH);
      
      expect(authItem).toBeDefined();
      expect(authItem!.children.length).toBeGreaterThan(0);
      
      const loginItem = authItem!.children.find(child => child.key === ROUTE_KEYS.AUTH_LOGIN);
      expect(loginItem).toBeDefined();
    });
  });

  describe('requiresAuth', () => {
    beforeEach(() => {
      mockValidRoutes.forEach(route => routeRegistry.register(route));
    });

    it('should return true for routes requiring authentication', () => {
      expect(service.requiresAuth(ROUTE_KEYS.DASHBOARD)).toBe(true);
    });

    it('should return false for routes not requiring authentication', () => {
      expect(service.requiresAuth(ROUTE_KEYS.AUTH_LOGIN)).toBe(false);
    });

    it('should return false for non-existing routes', () => {
      expect(service.requiresAuth('NON_EXISTING')).toBe(false);
    });
  });

  describe('getRequiredPermission', () => {
    beforeEach(() => {
      const routesWithPermissions: RouteMetadata[] = [
        {
          key: 'ADMIN_ROUTE',
          path: 'admin',
          label: 'Admin',
          requiresAuth: true,
          requiredPermission: 'admin'
        },
        {
          key: 'USER_ROUTE',
          path: 'user',
          label: 'User',
          requiresAuth: true
        }
      ];
      
      routesWithPermissions.forEach(route => routeRegistry.register(route));
    });

    it('should return permission for routes with required permission', () => {
      expect(service.getRequiredPermission('ADMIN_ROUTE')).toBe('admin');
    });

    it('should return undefined for routes without required permission', () => {
      expect(service.getRequiredPermission('USER_ROUTE')).toBeUndefined();
    });

    it('should return undefined for non-existing routes', () => {
      expect(service.getRequiredPermission('NON_EXISTING')).toBeUndefined();
    });
  });

  describe('integration with route registry', () => {
    it('should work with route registry state changes', () => {
      // Initially no routes
      expect(service.getConfigSummary().totalRoutes).toBe(0);
      
      // Add routes
      mockValidRoutes.forEach(route => routeRegistry.register(route));
      
      // Should reflect changes
      expect(service.getConfigSummary().totalRoutes).toBe(mockValidRoutes.length);
    });

    it('should handle registry errors gracefully', () => {
      // Registry allows re-registration of routes with the same key
      const route = { key: 'TEST', path: 'test', label: 'Test' };
      routeRegistry.register(route);
      
      // Should not throw when re-registering the same key
      expect(() => routeRegistry.register(route)).not.toThrow();
      
      // Should update the route metadata
      const updatedRoute = { key: 'TEST', path: 'test', label: 'Updated Test' };
      routeRegistry.register(updatedRoute);
      
      const retrievedMetadata = routeRegistry.getMetadata('TEST');
      expect(retrievedMetadata?.label).toBe('Updated Test');
    });
  });

  describe('error handling', () => {
    it('should provide meaningful error messages for validation failures', () => {
      // Register routes with various issues
      routeRegistry.register({
        key: 'ORPHANED',
        path: 'orphaned',
        label: 'Orphaned',
        parent: 'NON_EXISTING'
      });
      
      try {
        service.validateRoutes();
        fail('Expected validation to fail');
      } catch (error: any) {
        expect(error.message).toContain('Route validation failed');
        expect(error.message).toContain('Required route');
        expect(error.message).toContain('invalid parent');
      }
    });

    it('should handle empty route registry gracefully', () => {
      expect(() => service.getConfigSummary()).not.toThrow();
      expect(() => service.getRouteTree()).not.toThrow();
      expect(() => service.requiresAuth('ANY')).not.toThrow();
      expect(() => service.getRequiredPermission('ANY')).not.toThrow();
    });
  });
});