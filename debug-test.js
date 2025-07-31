// Debug script to test route resolution
const { routeRegistry } = require('./src/app/core/routing/registry/route-registry');

// Mock routes similar to test setup
const mockRoutes = [
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
  }
];

// Clear and register routes
routeRegistry.routes.clear();
routeRegistry.nodeCache.clear();

mockRoutes.forEach(route => {
  routeRegistry.register(route);
});

// Test path resolution
console.log('Testing path resolution:');
const segments = ['auth', 'login'];
const result = routeRegistry.findByPath(segments);
console.log('Segments:', segments);
console.log('Result:', result);

// Test full path building
const authLoginRoute = routeRegistry.getMetadata('AUTH_LOGIN');
if (authLoginRoute) {
  const fullPath = routeRegistry.buildFullPath(authLoginRoute);
  console.log('AUTH_LOGIN full path:', fullPath);
}