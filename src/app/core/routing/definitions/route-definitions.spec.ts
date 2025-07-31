/**
 * Unit tests for route-definitions.ts
 * Tests route keys, definitions, and initialization functionality
 */

import { routeRegistry } from "../registry";
import { initializeRoutes, ROUTE_KEYS, RouteKey } from "./route-definitions";


describe('RouteDefinitions', () => {
  beforeEach(() => {
    // Clear the registry before each test
    (routeRegistry as any).routes.clear();
    (routeRegistry as any).nodeCache.clear();
  });

  describe('ROUTE_KEYS', () => {
    it('should contain all required route keys', () => {
      expect(ROUTE_KEYS.ROOT).toBe('ROOT');
      expect(ROUTE_KEYS.AUTH).toBe('AUTH');
      expect(ROUTE_KEYS.AUTH_LOGIN).toBe('AUTH_LOGIN');
      expect(ROUTE_KEYS.AUTH_REGISTER).toBe('AUTH_REGISTER');
      expect(ROUTE_KEYS.AUTH_FORGOT_PASSWORD).toBe('AUTH_FORGOT_PASSWORD');
      expect(ROUTE_KEYS.DASHBOARD).toBe('DASHBOARD');
      expect(ROUTE_KEYS.DASHBOARD_OVERVIEW).toBe('DASHBOARD_OVERVIEW');
      expect(ROUTE_KEYS.NOT_FOUND).toBe('NOT_FOUND');
      expect(ROUTE_KEYS.UNAUTHORIZED).toBe('UNAUTHORIZED');
      expect(ROUTE_KEYS.SERVER_ERROR).toBe('SERVER_ERROR');
    });

    it('should be readonly constants', () => {
      // Test that ROUTE_KEYS values are constant strings
      expect(typeof ROUTE_KEYS.ROOT).toBe('string');
      expect(typeof ROUTE_KEYS.AUTH).toBe('string');
      expect(typeof ROUTE_KEYS.DASHBOARD).toBe('string');
      
      // Test that the object is defined as const
      expect(ROUTE_KEYS.ROOT).toBe('ROOT');
      expect(ROUTE_KEYS.AUTH).toBe('AUTH');
    });

    it('should have unique values', () => {
      const values = Object.values(ROUTE_KEYS);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);
    });
  });

  describe('initializeRoutes', () => {
    it('should register all routes in the registry', () => {
      initializeRoutes();
      
      const allRoutes = routeRegistry.getAllRoutes();
      expect(allRoutes.length).toBeGreaterThan(0);
      
      // Check that all route keys are registered
      Object.values(ROUTE_KEYS).forEach(routeKey => {
        const metadata = routeRegistry.getMetadata(routeKey);
        expect(metadata).toBeDefined();
        expect(metadata!.key).toBe(routeKey);
      });
    });

    it('should register routes with correct metadata structure', () => {
      initializeRoutes();
      
      const rootRoute = routeRegistry.getMetadata(ROUTE_KEYS.ROOT);
      expect(rootRoute).toEqual({
        key: ROUTE_KEYS.ROOT,
        path: '',
        label: 'Inicio',
        icon: 'home',
        order: 0
      });
    });

    it('should register auth routes with correct parent relationships', () => {
      initializeRoutes();
      
      const authRoute = routeRegistry.getMetadata(ROUTE_KEYS.AUTH);
      expect(authRoute!.parent).toBe(ROUTE_KEYS.ROOT);
      
      const loginRoute = routeRegistry.getMetadata(ROUTE_KEYS.AUTH_LOGIN);
      expect(loginRoute!.parent).toBe(ROUTE_KEYS.AUTH);
      
      const registerRoute = routeRegistry.getMetadata(ROUTE_KEYS.AUTH_REGISTER);
      expect(registerRoute!.parent).toBe(ROUTE_KEYS.AUTH);
      
      const forgotPasswordRoute = routeRegistry.getMetadata(ROUTE_KEYS.AUTH_FORGOT_PASSWORD);
      expect(forgotPasswordRoute!.parent).toBe(ROUTE_KEYS.AUTH);
    });

    it('should register dashboard routes with authentication requirements', () => {
      initializeRoutes();
      
      const dashboardRoute = routeRegistry.getMetadata(ROUTE_KEYS.DASHBOARD);
      expect(dashboardRoute!.requiresAuth).toBe(true);
      expect(dashboardRoute!.parent).toBe(ROUTE_KEYS.ROOT);
      
      const overviewRoute = routeRegistry.getMetadata(ROUTE_KEYS.DASHBOARD_OVERVIEW);
      expect(overviewRoute!.requiresAuth).toBe(true);
      expect(overviewRoute!.parent).toBe(ROUTE_KEYS.DASHBOARD);
    });

    it('should register error routes with correct order', () => {
      initializeRoutes();
      
      const notFoundRoute = routeRegistry.getMetadata(ROUTE_KEYS.NOT_FOUND);
      expect(notFoundRoute!.order).toBe(999);
      
      const unauthorizedRoute = routeRegistry.getMetadata(ROUTE_KEYS.UNAUTHORIZED);
      expect(unauthorizedRoute!.order).toBe(998);
      
      const serverErrorRoute = routeRegistry.getMetadata(ROUTE_KEYS.SERVER_ERROR);
      expect(serverErrorRoute!.order).toBe(997);
    });

    it('should handle multiple initializations gracefully', () => {
      initializeRoutes();
      const firstCount = routeRegistry.getAllRoutes().length;
      
      // Should not throw error on second initialization
      expect(() => initializeRoutes()).not.toThrow();
      
      // Should not duplicate routes
      const secondCount = routeRegistry.getAllRoutes().length;
      expect(secondCount).toBe(firstCount);
    });
  });

  describe('RouteKey type', () => {
    it('should be a union type of all route keys', () => {
      // This is a compile-time test, but we can verify the values
      const validKeys: RouteKey[] = [
        'ROOT',
        'AUTH',
        'AUTH_LOGIN',
        'AUTH_REGISTER',
        'AUTH_FORGOT_PASSWORD',
        'DASHBOARD',
        'DASHBOARD_OVERVIEW',
        'NOT_FOUND',
        'UNAUTHORIZED',
        'SERVER_ERROR'
      ];
      
      validKeys.forEach(key => {
        expect(Object.values(ROUTE_KEYS)).toContain(key);
      });
    });
  });

  describe('Route hierarchy validation', () => {
    beforeEach(() => {
      initializeRoutes();
    });

    it('should have proper parent-child relationships', () => {
      // Auth children
      const authChildren = routeRegistry.getChildren(ROUTE_KEYS.AUTH);
      expect(authChildren.length).toBe(3);
      expect(authChildren.map(child => child.metadata.key)).toContain(ROUTE_KEYS.AUTH_LOGIN);
      expect(authChildren.map(child => child.metadata.key)).toContain(ROUTE_KEYS.AUTH_REGISTER);
      expect(authChildren.map(child => child.metadata.key)).toContain(ROUTE_KEYS.AUTH_FORGOT_PASSWORD);
      
      // Dashboard children
      const dashboardChildren = routeRegistry.getChildren(ROUTE_KEYS.DASHBOARD);
      expect(dashboardChildren.length).toBe(1);
      expect(dashboardChildren[0].metadata.key).toBe(ROUTE_KEYS.DASHBOARD_OVERVIEW);
    });

    it('should order children correctly', () => {
      const authChildren = routeRegistry.getChildren(ROUTE_KEYS.AUTH);
      const orders = authChildren.map(child => child.metadata.order || 0);
      
      // Should be sorted in ascending order
      for (let i = 1; i < orders.length; i++) {
        expect(orders[i]).toBeGreaterThanOrEqual(orders[i - 1]);
      }
    });
  });
});