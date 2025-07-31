export interface RouteTreeItem {
  key: string;
  path: string;
  label: string;
  fullPath: string;
  requiresAuth: boolean;
  children: RouteTreeItem[];
}