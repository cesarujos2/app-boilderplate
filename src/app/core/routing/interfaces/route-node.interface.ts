import { RouteMetadata } from "./route-metadata.interface";

export interface RouteNode {
  readonly metadata: RouteMetadata;
  readonly fullPath: string;
  readonly children: RouteNode[];
  readonly parent?: RouteNode;
}