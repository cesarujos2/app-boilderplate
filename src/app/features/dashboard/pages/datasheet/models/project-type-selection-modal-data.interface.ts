import { ProjectType } from './project-type.interface';

export interface ProjectTypeSelectionModalData {
  projectTypes: ProjectType[];
}

export interface ProjectTypeSelectionModalResult {
  selectedProjectType: ProjectType;
}
