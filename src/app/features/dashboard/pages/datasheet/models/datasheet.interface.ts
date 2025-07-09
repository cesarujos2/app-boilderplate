import { ProjectTypeAcronym } from "./project-type.interface";

export type FitacStatus = 'VALIDATED' | 'FOR_SIGNATURE' | 'PRESENTED' | 'UNDER_REVIEW' | 'RESOLVED';

export interface RequestStatus {
  id: number;
  key: FitacStatus;
  name: string;
  description: string;
  transitionName: string;
  userRole: string;
  nextStatusId: number;
}

export interface DatasheetRequest {
  page?: number;
  pageSize?: number;
  order?: number;
  orderToModificationDate?: boolean,
  seeker?: string;
  requestNumber?: string;
  expedientNumber?: string;
  creationDateFrom?: string;
  creationDateTo?: string;
  modificationDateFrom?: string;
  modificationDateTo?: string;
  consultantName?: string;
  legalRepresentativeName?: string;
  companyName?: string;
  fitacStatus?: string;
}

export interface DatasheetResponse  {
  total: number;
  content: Datasheet[];
}


export interface Datasheet {
  id: number;
  projectType: ProjectTypeAcronym
  idHashed: string;
  projectName: string;
  requestNumber: string;
  expedientNumber: string;
  creationDate: string;
  modificationDate: string;
  consultantName: string;
  legalRepresentativeName: string;
  companyName: string;
  fitacStatus: FitacStatus;
  fitacFileId: string;
  officeFileId: string;
  datasheetMods: DatasheetMod[];
}

export interface DatasheetMod {
  id: number;
  requestNumber: string;
  expedientNumber: string;
  fitacStatus: FitacStatus;
  fitacFileId: string;
  creationDate: string;
  modificationDate: string;
  officeFileId: string;
}

export interface  IChangeStatus
{
    id: string;
    idMod?: number;
    status: string;
    password?: string;
}

export interface IChangeStatusResponse
{
    success: boolean;
    status: string;
    message?: string;
    requestNumber?: string;
}
