interface RouteNode {
  path: string;
  label: string;
  parent?: RouteNode;
  fullPath(): string;
  fullLabels: string[];
}