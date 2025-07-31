/**
 * Route Registry - Centralized route management following SOLID principles
 */

import { RouteMetadata } from "../interfaces";
import { RouteNode } from "../interfaces/route-node.interface";

/**
 * Immutable route registry that manages all application routes
 */
export class RouteRegistry {
  private readonly routes = new Map<string, RouteMetadata>();
  private readonly nodeCache = new Map<string, RouteNode>();

  /**
   * Register a new route in the registry
   */
  register(metadata: RouteMetadata): void {
    // Allow re-registration of routes with the same key
    this.routes.set(metadata.key, metadata);
    this.nodeCache.clear(); // Clear cache when routes change
  }

  /**
   * Clear all routes from the registry
   */
  clear(): void {
    this.routes.clear();
    this.nodeCache.clear();
  }

  /**
   * Get route metadata by key
   */
  getMetadata(key: string): RouteMetadata | undefined {
    return this.routes.get(key);
  }

  /**
   * Get all registered routes
   */
  getAllRoutes(): RouteMetadata[] {
    return Array.from(this.routes.values());
  }

  /**
   * Get route node with computed properties
   */
  getNode(key: string): RouteNode | undefined {
    if (this.nodeCache.has(key)) {
      return this.nodeCache.get(key);
    }

    const metadata = this.routes.get(key);
    if (!metadata) {
      return undefined;
    }

    // Create a placeholder node first to prevent infinite recursion
    const placeholder: RouteNode = {
      metadata,
      fullPath: '',
      children: [],
      parent: undefined
    };
    this.nodeCache.set(key, placeholder);

    // Now build the actual node
    const node = this.buildNode(metadata);
    this.nodeCache.set(key, node);
    return node;
  }

  /**
   * Get children of a route
   */
  getChildren(parentKey: string): RouteNode[] {
    return Array.from(this.routes.values())
      .filter(route => route.parent === parentKey)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(metadata => this.getNode(metadata.key)!)
      .filter(Boolean);
  }

  /**
   * Find route by path segments
   */
  findByPath(segments: string[]): RouteNode | undefined {
    // Handle empty segments (root path)
    if (segments.length === 0) {
      const rootRoute = Array.from(this.routes.values())
        .find(route => !route.parent && route.path === '');
      return rootRoute ? this.getNode(rootRoute.key) : undefined;
    }

    // Try to find exact match first
    const targetPath = '/' + segments.join('/');
    let bestMatch: RouteMetadata | undefined;
    
    for (const route of this.routes.values()) {
      const fullPath = this.buildFullPath(route);
      if (fullPath === targetPath) {
        bestMatch = route;
        break;
      }
    }
    
    return bestMatch ? this.getNode(bestMatch.key) : undefined;
  }


  private buildNode(metadata: RouteMetadata): RouteNode {
    const fullPath = this.buildFullPath(metadata);
    const children = this.getChildren(metadata.key);
    
    // Get parent node properly to maintain the chain
    const parent = metadata.parent ? this.getNode(metadata.parent) : undefined;

    return {
      metadata,
      fullPath,
      children,
      parent
    };
  }

  private buildFullPath(metadata: RouteMetadata): string {
    const segments: string[] = [];
    const visited = new Set<string>();
    let current: RouteMetadata | undefined = metadata;

    while (current && !visited.has(current.key)) {
      visited.add(current.key);
      if (current.path) {
        segments.unshift(current.path);
      }
      current = current.parent ? this.routes.get(current.parent) : undefined;
    }

    // Handle root path case
    if (segments.length === 0) {
      return '/';
    }
    
    const fullPath = '/' + segments.join('/');
    return fullPath.replace(/\/+/g, '/');
  }
}

// Global registry instance
export const routeRegistry = new RouteRegistry();