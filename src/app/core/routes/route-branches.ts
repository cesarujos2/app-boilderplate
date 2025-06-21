import { RouteTreeNode } from './route-tree-node';

// Crear el nodo raíz y las ramas principales en un archivo separado
// para evitar dependencias circulares
const ROOT_ROUTE_NODE = new RouteTreeNode('', 'Inicio');

export const ROOT_ROUTE_BRANCHES = {
    BASE: ROOT_ROUTE_NODE,
    AUTH: ROOT_ROUTE_NODE.addChild('AUTH', 'auth', 'Autenticación'),
    DASHBOARD: ROOT_ROUTE_NODE.addChild('DASHBOARD', 'dashboard', 'Principal'),
};
