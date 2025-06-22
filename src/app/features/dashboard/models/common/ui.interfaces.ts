/**
 * Interfaces comunes para componentes de UI
 */

/**
 * Contract for expandable content components
 * Usado por componentes que pueden expandirse/contraerse
 */
export interface IExpandableContent {
  toggle(): void;
  isExpanded(): boolean;
}

/**
 * Contract for trackable items in lists
 * Usado para optimizar rendering en *ngFor
 */
export interface ITrackableItem {
  id: string | number;
}

/**
 * Contract for components that provide trackBy functionality
 */
export interface ITrackByProvider {
  trackById(index: number, item: ITrackableItem): any;
}
