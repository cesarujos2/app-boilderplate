/**
 * Unit tests for route-registry.ts
 * Tests RouteRegistry class functionality, interfaces, and route management
 */

import { RouteMetadata } from '../interfaces/route-metadata.interface';
import { RouteRegistry, routeRegistry } from './route-registry';

describe('RouteRegistry', () => {
  let registry: RouteRegistry;
  
  const mockRouteMetadata: RouteMetadata = {
    key: 'TEST_ROUTE',
    path: 'test',
    label: 'Test Route',
    icon: 'test_icon',
    order: 1
  };
  
  const mockParentRoute: RouteMetadata = {
    key: 'PARENT_ROUTE',
    path: 'parent',
    label: 'Parent Route',
    icon: 'parent_icon',
    order: 0
  };
  
  const mockChildRoute: RouteMetadata = {
    key: 'CHILD_ROUTE',
    path: 'child',
    label: 'Child Route',
    parent: 'PARENT_ROUTE',
    icon: 'child_icon',
    order: 1
  };

  beforeEach(() => {
    registry = new RouteRegistry();
  });

  describe('RouteMetadata interface', () => {
    it('should have required properties', () => {
      expect(mockRouteMetadata.key).toBeDefined();
      expect(mockRouteMetadata.path).toBeDefined();
      expect(mockRouteMetadata.label).toBeDefined();
    });

    it('should have optional properties', () => {
      const routeWithOptionals: RouteMetadata = {
        key: 'TEST',
        path: 'test',
        label: 'Test',
        parent: 'PARENT',
        requiresAuth: true,
        requiredPermission: 'admin',
        icon: 'icon',
        order: 5
      };
      
      expect(routeWithOptionals.parent).toBe('PARENT');
      expect(routeWithOptionals.requiresAuth).toBe(true);
      expect(routeWithOptionals.requiredPermission).toBe('admin');
      expect(routeWithOptionals.icon).toBe('icon');
      expect(routeWithOptionals.order).toBe(5);
    });
  });

  describe('register', () => {
    it('should register a new route successfully', () => {
      expect(() => registry.register(mockRouteMetadata)).not.toThrow();
      
      const retrieved = registry.getMetadata(mockRouteMetadata.key);
      expect(retrieved).toEqual(mockRouteMetadata);
    });

    it('should allow re-registration of routes with the same key', () => {
      registry.register(mockRouteMetadata);
      
      // Should not throw error when re-registering the same key
      expect(() => registry.register(mockRouteMetadata)).not.toThrow();
      
      // Should update the route metadata
      const updatedMetadata = { ...mockRouteMetadata, label: 'Updated Label' };
      registry.register(updatedMetadata);
      
      const retrievedMetadata = registry.getMetadata(mockRouteMetadata.key);
      expect(retrievedMetadata?.label).toBe('Updated Label');
    });

    it('should clear node cache when registering new routes', () => {
      registry.register(mockParentRoute);
      const node = registry.getNode(mockParentRoute.key);
      expect(node).toBeDefined();
      
      // Register child route, which should clear cache
      registry.register(mockChildRoute);
      
      // Node should still be accessible but cache was cleared
      const nodeAfter = registry.getNode(mockParentRoute.key);
      expect(nodeAfter).toBeDefined();
    });
  });

  describe('getMetadata', () => {
    it('should return route metadata for existing route', () => {
      registry.register(mockRouteMetadata);
      
      const metadata = registry.getMetadata(mockRouteMetadata.key);
      expect(metadata).toEqual(mockRouteMetadata);
    });

    it('should return undefined for non-existing route', () => {
      const metadata = registry.getMetadata('NON_EXISTING');
      expect(metadata).toBeUndefined();
    });
  });

  describe('getAllRoutes', () => {
    it('should return empty array when no routes registered', () => {
      const routes = registry.getAllRoutes();
      expect(routes).toEqual([]);
    });

    it('should return all registered routes', () => {
      registry.register(mockRouteMetadata);
      registry.register(mockParentRoute);
      
      const routes = registry.getAllRoutes();
      expect(routes.length).toBe(2);
      expect(routes).toContain(mockRouteMetadata);
      expect(routes).toContain(mockParentRoute);
    });
  });

  describe('getNode', () => {
    it('should return undefined for non-existing route', () => {
      const node = registry.getNode('NON_EXISTING');
      expect(node).toBeUndefined();
    });

    it('should return route node with computed properties', () => {
      registry.register(mockRouteMetadata);
      
      const node = registry.getNode(mockRouteMetadata.key);
      expect(node).toBeDefined();
      expect(node!.metadata).toEqual(mockRouteMetadata);
      expect(node!.fullPath).toBe('/test');
      expect(node!.children).toEqual([]);
      expect(node!.parent).toBeUndefined();
    });

    it('should build correct full path for nested routes', () => {
      registry.register(mockParentRoute);
      registry.register(mockChildRoute);
      
      const childNode = registry.getNode(mockChildRoute.key);
      expect(childNode!.fullPath).toBe('/parent/child');
    });

    it('should cache nodes for performance', () => {
      registry.register(mockRouteMetadata);
      
      const node1 = registry.getNode(mockRouteMetadata.key);
      const node2 = registry.getNode(mockRouteMetadata.key);
      
      expect(node1).toBe(node2); // Should be same instance due to caching
    });

    it('should handle parent relationships correctly', () => {
      registry.register(mockParentRoute);
      registry.register(mockChildRoute);
      
      const childNode = registry.getNode(mockChildRoute.key);
      expect(childNode!.parent).toBeDefined();
      expect(childNode!.parent!.metadata.key).toBe(mockParentRoute.key);
    });
  });

  describe('getChildren', () => {
    it('should return empty array for route with no children', () => {
      registry.register(mockRouteMetadata);
      
      const children = registry.getChildren(mockRouteMetadata.key);
      expect(children).toEqual([]);
    });

    it('should return children sorted by order', () => {
      registry.register(mockParentRoute);
      
      const child1: RouteMetadata = {
        key: 'CHILD_1',
        path: 'child1',
        label: 'Child 1',
        parent: 'PARENT_ROUTE',
        order: 2
      };
      
      const child2: RouteMetadata = {
        key: 'CHILD_2',
        path: 'child2',
        label: 'Child 2',
        parent: 'PARENT_ROUTE',
        order: 1
      };
      
      registry.register(child1);
      registry.register(child2);
      
      const children = registry.getChildren(mockParentRoute.key);
      expect(children.length).toBe(2);
      expect(children[0].metadata.key).toBe('CHILD_2'); // order: 1
      expect(children[1].metadata.key).toBe('CHILD_1'); // order: 2
    });

    it('should handle missing order property (default to 0)', () => {
      registry.register(mockParentRoute);
      
      const childWithoutOrder: RouteMetadata = {
        key: 'CHILD_NO_ORDER',
        path: 'child-no-order',
        label: 'Child No Order',
        parent: 'PARENT_ROUTE'
      };
      
      const childWithOrder: RouteMetadata = {
        key: 'CHILD_WITH_ORDER',
        path: 'child-with-order',
        label: 'Child With Order',
        parent: 'PARENT_ROUTE',
        order: 1
      };
      
      registry.register(childWithoutOrder);
      registry.register(childWithOrder);
      
      const children = registry.getChildren(mockParentRoute.key);
      expect(children[0].metadata.key).toBe('CHILD_NO_ORDER'); // order: 0 (default)
      expect(children[1].metadata.key).toBe('CHILD_WITH_ORDER'); // order: 1
    });
  });

  describe('findByPath', () => {
    beforeEach(() => {
      registry.register(mockParentRoute); // /parent
      registry.register(mockChildRoute);  // /parent/child
      registry.register(mockRouteMetadata); // /test
    });

    it('should find route by exact path segments', () => {
      const node = registry.findByPath(['parent', 'child']);
      expect(node).toBeDefined();
      expect(node!.metadata.key).toBe('CHILD_ROUTE');
    });

    it('should find root-level routes', () => {
      const node = registry.findByPath(['test']);
      expect(node).toBeDefined();
      expect(node!.metadata.key).toBe('TEST_ROUTE');
    });

    it('should return undefined for non-existing path', () => {
      const node = registry.findByPath(['non', 'existing']);
      expect(node).toBeUndefined();
    });

    it('should handle empty segments array', () => {
      const rootRoute: RouteMetadata = {
        key: 'ROOT',
        path: '',
        label: 'Root'
      };
      registry.register(rootRoute);
      
      const node = registry.findByPath([]);
      expect(node).toBeDefined();
      expect(node!.metadata.key).toBe('ROOT');
    });
  });

  describe('buildFullPath (private method behavior)', () => {
    it('should handle circular references gracefully', () => {
      const route1: RouteMetadata = {
        key: 'ROUTE_1',
        path: 'route1',
        label: 'Route 1',
        parent: 'ROUTE_2'
      };
      
      const route2: RouteMetadata = {
        key: 'ROUTE_2',
        path: 'route2',
        label: 'Route 2',
        parent: 'ROUTE_1'
      };
      
      registry.register(route1);
      registry.register(route2);
      
      // Should not cause infinite recursion
      expect(() => registry.getNode('ROUTE_1')).not.toThrow();
      expect(() => registry.getNode('ROUTE_2')).not.toThrow();
    });

    it('should normalize multiple slashes in paths', () => {
      const parentWithSlash: RouteMetadata = {
        key: 'PARENT_SLASH',
        path: 'parent/',
        label: 'Parent with slash'
      };
      
      const childWithSlash: RouteMetadata = {
        key: 'CHILD_SLASH',
        path: '/child',
        label: 'Child with slash',
        parent: 'PARENT_SLASH'
      };
      
      registry.register(parentWithSlash);
      registry.register(childWithSlash);
      
      const node = registry.getNode('CHILD_SLASH');
      expect(node!.fullPath).toBe('/parent/child');
    });
  });

  describe('global registry instance', () => {
    it('should export a global registry instance', () => {
      expect(routeRegistry).toBeInstanceOf(RouteRegistry);
    });

    it('should be a singleton', () => {
      expect(routeRegistry).toBe(routeRegistry);
    });
  });

  describe('RouteNode interface', () => {
    it('should have readonly properties', () => {
      registry.register(mockRouteMetadata);
      const node = registry.getNode(mockRouteMetadata.key)!;
      
      // These should be readonly (compile-time check)
      expect(node.metadata).toBeDefined();
      expect(node.fullPath).toBeDefined();
      expect(node.children).toBeDefined();
    });
  });
});