export class RouteTreeNode {
  private children: Record<string, RouteTreeNode> = {}
  constructor(
    public readonly path: string,
    public readonly label: string,
    public readonly parent?: RouteTreeNode,
  ) { }

  fullPath(): string[] {
    const segments: string[] = [];
    let node: RouteTreeNode | undefined = this;
    while (node && node.path !== '') {
      segments.unshift(node.path);
      node = node.parent;
    }
    return segments;
  }

  fullLabels(): string[] {
    const labels: string[] = [];
    let node: RouteTreeNode | undefined = this;
    while (node) {
      if (node.label) labels.unshift(node.label);
      node = node.parent;
    }
    return labels;
  }

  addChild(key: string, path: string, label: string): RouteTreeNode {
    const child = new RouteTreeNode(path, label, this);
    this.children[key] = child;
    return child;
  }
}
