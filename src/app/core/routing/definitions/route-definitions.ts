/**
 * Route Definitions - Centralized route keys and metadata
 * 
 * This file contains all route definitions in a single place, eliminating
 * circular dependencies. Routes are defined as constants that can be safely
 * imported anywhere without causing circular dependency issues.
 */

import { RouteMetadata } from "../interfaces/route-metadata.interface";
import { routeRegistry } from "../registry/route-registry";


/**
 * Route Keys - Type-safe constants for all routes
 * These keys are used throughout the application for navigation
 */
export const ROUTE_KEYS = {
  // Root routes
  ROOT: 'ROOT',
  
  // Authentication routes
  AUTH: 'AUTH',
  AUTH_LOGIN: 'AUTH_LOGIN',
  AUTH_REGISTER: 'AUTH_REGISTER',
  AUTH_FORGOT_PASSWORD: 'AUTH_FORGOT_PASSWORD',
  
  // Dashboard routes
  DASHBOARD: 'DASHBOARD',
  DASHBOARD_OVERVIEW: 'DASHBOARD_OVERVIEW',
  
  // Error routes
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  SERVER_ERROR: 'SERVER_ERROR'
} as const;

/**
 * Route metadata definitions
 * All routes are defined here with their metadata
 */
const ROUTE_DEFINITIONS: RouteMetadata[] = [
  // Root route
  {
    key: ROUTE_KEYS.ROOT,
    path: '',
    label: 'Inicio',
    icon: 'home',
    order: 0
  },
  
  // Authentication routes
  {
    key: ROUTE_KEYS.AUTH,
    path: 'auth',
    label: 'Autenticación',
    parent: ROUTE_KEYS.ROOT,
    icon: 'login',
    order: 1
  },
  {
    key: ROUTE_KEYS.AUTH_LOGIN,
    path: 'login',
    label: 'Iniciar Sesión',
    parent: ROUTE_KEYS.AUTH,
    icon: 'login',
    order: 1
  },
  {
    key: ROUTE_KEYS.AUTH_REGISTER,
    path: 'register',
    label: 'Registrarse',
    parent: ROUTE_KEYS.AUTH,
    icon: 'person_add',
    order: 2
  },
  {
    key: ROUTE_KEYS.AUTH_FORGOT_PASSWORD,
    path: 'forgot-password',
    label: 'Recuperar Contraseña',
    parent: ROUTE_KEYS.AUTH,
    icon: 'lock_reset',
    order: 3
  },
  
  // Dashboard routes
  {
    key: ROUTE_KEYS.DASHBOARD,
    path: 'dashboard',
    label: 'Panel Principal',
    parent: ROUTE_KEYS.ROOT,
    requiresAuth: true,
    icon: 'dashboard',
    order: 2
  },
  {
    key: ROUTE_KEYS.DASHBOARD_OVERVIEW,
    path: 'overview',
    label: 'Resumen General',
    parent: ROUTE_KEYS.DASHBOARD,
    requiresAuth: true,
    icon: 'analytics',
    order: 1
  },
  
  // Error routes
  {
    key: ROUTE_KEYS.NOT_FOUND,
    path: '404',
    label: 'Página No Encontrada',
    parent: ROUTE_KEYS.ROOT,
    icon: 'error',
    order: 999
  },
  {
    key: ROUTE_KEYS.UNAUTHORIZED,
    path: '401',
    label: 'No Autorizado',
    parent: ROUTE_KEYS.ROOT,
    icon: 'block',
    order: 998
  },
  {
    key: ROUTE_KEYS.SERVER_ERROR,
    path: '500',
    label: 'Error del Servidor',
    parent: ROUTE_KEYS.ROOT,
    icon: 'warning',
    order: 997
  }
];

/**
 * Initialize the route registry with all route definitions
 * This function should be called once during application bootstrap
 */
export function initializeRoutes(): void {
  ROUTE_DEFINITIONS.forEach(route => {
    routeRegistry.register(route);
  });
}

/**
 * Type-safe route keys type
 */
export type RouteKey = typeof ROUTE_KEYS[keyof typeof ROUTE_KEYS];