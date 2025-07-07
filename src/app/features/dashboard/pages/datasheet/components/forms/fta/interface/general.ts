export interface IValidateLegalRepresentativeResponse {
  organizationName: string;
  name: string;
}

export interface IMaster {
  code?: string;
  name?: string;
  value1?: string;
  value2?: string;
  value3?: string;
}

export interface IInfraestructureRules {
  mimicryTypes: IMaster[];
  showMimicryList: boolean;
  showWiringFields: boolean;
  showRooftopFields: boolean;
}

export interface IMeasures extends IMaster {
    value4?: string;
    value5?: string;
    value6?: string;
    value7?: string;
}

export interface IItem {
  code?: string;
  name?: string;
}

export interface IPersonType extends IItem {
  isLegalEntity?: boolean;
}

export interface IDocumentType extends IItem {
  personTypeCode?: string;
}

export interface IUbigeo extends IItem {
  id?: number;
  children?: IUbigeo[];
}

export interface IInitialData {
  personTypes?: IPersonType[];
  documentTypes?: IDocumentType[];
  deparments?: IUbigeo[];
  zoningTypes?: IMaster[];
  infraestructureTypes?: IMaster[];
  wiringCode?: string;
  rooftopCode?: string;
  radiodifusionCode?: string;
  withoutMimicryCode?: string;
  environmentTypes?: IMaster[];
  stages?: IMaster[];
  impactComponents?: IMaster[];
  urlMPV?: string;
  googleApiKey?: string;
  otherMimicryCode?: string;
}