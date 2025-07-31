/**
 * Route Configuration Service - Manages route initialization and validation
 * 
 * This service handles the setup and validation of the routing system,
 * ensuring all routes are properly configured and accessible.
 */

import { Injectable } from '@angular/core';
import { RouteTreeItem } from '../interfaces/route-item-tree.interface';
import { initializeRoutes, ROUTE_KEYS } from '../definitions';
import { routeRegistry } from '../registry';
import { RouteNode } from '../interfaces/route-node.interface';

@Injectable({
  providedIn: 'root'
})
export class RouteConfigService {
  private initialized = false;

  /**
   * Initialize the routing system
   * Should be called once during application bootstrap
   */
  initialize(): void {
    if (this.initialized) {
      console.warn('Route system already initialized');
      return;
    }

    try {
      initializeRoutes();
      this.validateRoutes();
      this.initialized = true;
      console.log('Route system initialized successfully');
    } catch (error) {
      this.initialized = false;
      console.error('Failed to initialize route system:', error);
      throw error;
    }
  }

  /**
   * Check if the routing system is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Reset the initialization state (for testing purposes)
   */
  reset(): void {
    this.initialized = false;
  }

  /**
   * Get route configuration summary
   */
  getConfigSummary(): {
    totalRoutes: number;
    authRoutes: number;
    publicRoutes: number;
    errorRoutes: number;
  } {
    const allRoutes = routeRegistry.getAllRoutes();
    
    return {
      totalRoutes: allRoutes.length,
      authRoutes: allRoutes.filter(route => route.requiresAuth).length,
      publicRoutes: allRoutes.filter(route => !route.requiresAuth).length,
      errorRoutes: allRoutes.filter(route => 
        route.key === 'SERVER_ERROR' || 
        route.key === 'NOT_FOUND' || 
        route.key === 'UNAUTHORIZED' ||
        route.key === 'NOT_FOUND_ERROR' ||
        route.key === 'UNAUTHORIZED_ERROR'
      ).length
    };
  }

  /**
   * Validate route configuration
   */
  validateRoutes(): void {
    const allRoutes = routeRegistry.getAllRoutes();
    const errors: string[] = [];

    // Check for required routes
    const requiredRoutes = [
      ROUTE_KEYS.ROOT,
      ROUTE_KEYS.AUTH,
      ROUTE_KEYS.AUTH_LOGIN,
      ROUTE_KEYS.DASHBOARD,
      ROUTE_KEYS.NOT_FOUND
    ];

    requiredRoutes.forEach(routeKey => {
      if (!routeRegistry.getNode(routeKey)) {
        errors.push(`Required route '${routeKey}' is missing`);
      }
    });

    // Check for orphaned routes (routes with invalid parent)
    allRoutes.forEach(route => {
      if (route.parent && !routeRegistry.getNode(route.parent)) {
        errors.push(`Route '${route.key}' has invalid parent '${route.parent}'`);
      }
    });

    // Check for duplicate paths at the same level
    const pathGroups = new Map<string, string[]>();
    allRoutes.forEach(route => {
      const parentKey = route.parent || 'ROOT';
      if (!pathGroups.has(parentKey)) {
        pathGroups.set(parentKey, []);
      }
      pathGroups.get(parentKey)!.push(route.path);
    });

    pathGroups.forEach((paths, parent) => {
      const duplicates = paths.filter((path, index) => paths.indexOf(path) !== index);
      if (duplicates.length > 0) {
        errors.push(`Duplicate paths found under parent '${parent}': ${duplicates.join(', ')}`);
      }
    });

    if (errors.length > 0) {
      throw new Error(`Route validation failed:\n${errors.join('\n')}`);
    }
  }

  /**
   * Get route tree for debugging
   */
  getRouteTree(): RouteTreeItem[] {
    const rootNodes = routeRegistry.getAllRoutes()
      .filter(route => !route.parent)
      .map(route => routeRegistry.getNode(route.key)!)
      .filter(Boolean);

    return rootNodes.map(node => this.buildTreeItem(node));
  }

  /**
   * Check if a route requires authentication
   */
  requiresAuth(routeKey: string): boolean {
    const node = routeRegistry.getNode(routeKey);
    return node?.metadata.requiresAuth === true;
  }

  /**
   * Get required permission for a route
   */
  getRequiredPermission(routeKey: string): string | undefined {
    const node = routeRegistry.getNode(routeKey);
    return node?.metadata.requiredPermission;
  }

  private buildTreeItem(node: RouteNode): RouteTreeItem {
    return {
      key: node.metadata.key,
      path: node.metadata.path,
      label: node.metadata.label,
      fullPath: node.fullPath,
      requiresAuth: node.metadata.requiresAuth || false,
      children: node.children.map(child => this.buildTreeItem(child))
    };
  }
}