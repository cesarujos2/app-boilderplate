import { Routes } from "@angular/router";
import { DASHBOARD_ROUTE_BRANCHES } from "../dashboard.routes";
import AdminComponent from "./admin.page";

const ADMIN_ROUTE_NODE = DASHBOARD_ROUTE_BRANCHES.ADMIN;

export const ADMIN_ROUTE_BRANCHES = {
    BASE: ADMIN_ROUTE_NODE,
    TASKS: ADMIN_ROUTE_NODE.addChild('TASKS', 'tasks', 'Tareas Programadas'),
    LOGS: ADMIN_ROUTE_NODE.addChild('LOGS', 'logs', 'Registros'),
}

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: '',
                redirectTo: ADMIN_ROUTE_BRANCHES.TASKS.path,
                pathMatch: 'full',
            },
            {
                path: ADMIN_ROUTE_BRANCHES.TASKS.path,
                loadComponent: () => import('./pages/tasks/tasks.page'),
            },
            {
                path: ADMIN_ROUTE_BRANCHES.LOGS.path,
                loadComponent: () => import('./pages/log/log.page'),
            },
            {
                path: '**',
                redirectTo: ADMIN_ROUTE_BRANCHES.TASKS.path,
            }
        ]
    }
];