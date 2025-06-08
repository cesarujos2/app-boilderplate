import { RouteTreeNode } from "./route-tree-node";

export function findRouteNodeByPath(
  root: RouteTreeNode,
  segments: string[]
): RouteTreeNode | undefined {
  let current: RouteTreeNode | undefined = root;

  for (const segment of segments) {
    if (!current) break;
    const children = current.getChildren();
    const next = Object.values(children).find(child => child.path === segment);
    if (!next) return undefined;
    current = next;
  }

  return current;
}

export function findRouteNodeByUrl(root: RouteTreeNode, url: string): RouteTreeNode | undefined {
  const segments = url.split('/').filter(Boolean);
  return findRouteNodeByPath(root, segments);
}
