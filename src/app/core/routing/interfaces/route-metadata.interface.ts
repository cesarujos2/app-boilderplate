export interface RouteMetadata {
  readonly key: string;
  readonly path: string;
  readonly label: string;
  readonly parent?: string;
  readonly requiresAuth?: boolean;
  readonly requiredPermission?: string;
  readonly icon?: string;
  readonly order?: number;
}