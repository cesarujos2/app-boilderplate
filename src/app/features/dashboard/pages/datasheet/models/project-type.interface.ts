export type ProjectTypeAcronym = 'FTA' | 'IAE';

export interface ProjectType {
  id: number;
  acronym: ProjectTypeAcronym;
  name: string;
  description: string;
}