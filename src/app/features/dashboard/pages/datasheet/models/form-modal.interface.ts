import { ProjectTypeAcronym } from './project-type.interface';

export type FormModalMode = 'create' | 'edit' | 'view';

export interface FormModalData {
    mode: FormModalMode;
    projectTypeAcronym: ProjectTypeAcronym;
    datasheetId?: string;
}

export interface FormModalResult {
    success: boolean;
    data?: any;
}

export interface FormModalConfig {
    component: any;
    width?: string;
    maxWidth?: string;
    minWidth?: string;
    height?: string;
    maxHeight?: string;
    disableClose?: boolean;
    closeOnNavigation?: boolean;
}
