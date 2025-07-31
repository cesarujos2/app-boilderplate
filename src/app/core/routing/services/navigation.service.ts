/**
 * Navigation Service - Centralized navigation management
 * 
 * Provides a clean API for navigation while abstracting away the complexity
 * of route management. Follows SOLID principles and eliminates direct
 * dependencies on route definitions.
 */

import { Injectable, inject, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs';
import { routeRegistry } from '../registry';
import { RouteNode } from '../interfaces/route-node.interface';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly router = inject(Router);
  private readonly currentRoute = signal<RouteNode | null>(null);


  /**
   * Observable of navigation state
   */
  readonly isNavigating$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(() => false)
  );

  constructor() {
    this.initializeRouteTracking();
  }

  /**
   * Navigate to a route by key
   */
  navigateToRoute(routeKey: string, extras?: { queryParams?: any; fragment?: string }): Promise<boolean> {
    const node = routeRegistry.getNode(routeKey);
    if (!node) {
      console.warn(`Route with key '${routeKey}' not found`);
      return Promise.resolve(false);
    }

    const navigationExtras = {
      queryParams: extras?.queryParams,
      fragment: extras?.fragment
    };

    return this.router.navigate([node.fullPath], navigationExtras);
  }

  /**
   * Navigate to a path with parameters
   */
  navigateToPath(path: string, params?: Record<string, any>): Promise<boolean> {
    let finalPath = path;
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        finalPath = finalPath.replace(`:${key}`, String(value));
      });
    }

    return this.router.navigate([finalPath]);
  }

  /**
   * Navigate back in history
   */
  goBack(): void {
    window.history.back();
  }

  /**
   * Navigate forward in history
   */
  goForward(): void {
    window.history.forward();
  }

  /**
   * Get current route node
   */
  getCurrentRoute(): RouteNode | null {
    return this.currentRoute();
  }

  /**
   * Check if a route exists
   */
  routeExists(routeKey: string): boolean {
    return routeRegistry.getNode(routeKey) !== undefined;
  }

  /**
   * Get route URL by key
   */
  getRouteUrl(routeKey: string): string | null {
    const node = routeRegistry.getNode(routeKey);
    return node ? node.fullPath : null;
  }

  /**
   * Check if current route matches the given key
   */
  isCurrentRoute(routeKey: string): boolean {
    const current = this.getCurrentRoute();
    if (!current) return false;
    return current.metadata.key === routeKey;
  }

  /**
   * Check if current route is child of given route
   */
  isChildOfRoute(parentRouteKey: string): boolean {
    const current = this.getCurrentRoute();
    if (!current) return false;

    // Check if any parent matches the parent route key
    let parent = current.parent;
    while (parent) {
      if (parent.metadata.key === parentRouteKey) {
        return true;
      }
      parent = parent.parent;
    }
    return false;
  }

  /**
   * Get children routes of a given route
   */
  getChildRoutes(parentRouteKey: string): RouteNode[] {
    return routeRegistry.getChildren(parentRouteKey);
  }

  private initializeRouteTracking(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateCurrentRoute(event.url);
    });

    // Initialize with current URL
    this.updateCurrentRoute(this.router.url);
  }

  private updateCurrentRoute(url: string): void {
    // Remove query params and fragments for route matching
    const cleanUrl = url.split('?')[0].split('#')[0];
    const segments = cleanUrl.split('/').filter(Boolean);
    
    const node = routeRegistry.findByPath(segments);
    
    this.currentRoute.set(node || null);
  }
}