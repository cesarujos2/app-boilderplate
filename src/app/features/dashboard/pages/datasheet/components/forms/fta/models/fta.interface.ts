export interface IFTA {
    id: string | null;
    projectType: string;
    isRaiseObs: boolean;
    legalRepresentative: IPerson;
    // consultant: IPerson;
    projectInformation: IProjectInformation;
    technicalDescriptions: ITechnicalDescription;
    measures: IMeasures;
    schedule: ISchedule;
    attachments: IAttachments;
}

export interface IPerson {
    documentType: string;
    documentNumber: string;
    contactDocumentType: string;
    contactDocumentNumber: string;
}

export interface IProjectInformation {
    projectName: string;
    objetive: string;
    locations: IGeopoliticalLocation[];
    localization: ILocalization;
    zoning?: string;
    area?: number;
    perimeter?: number;
    budget: string;
    lifetime: number;
}

export interface IGeopoliticalLocation {
    department: string;
    province: string;
    district: string;
}

export interface ILocalization {
    registerType: "FILE" | "UTM" | "GEO";
    file?: File;
    coordinatesUTM?: ICoordinatesUTM[];
    coordinatesGeo?: ICoordinatesGeo[];
}

export interface ICoordinatesUTM {
    zone: string;
    easting: string;
    northing: string;
}

export interface ICoordinatesGeo {
    lat: string;
    lng: string;
}

export interface ITechnicalDescription {
    infraestrutureType: string;
    mimicryType?: string;
    aerialLength?: number;
    undergroundLength?: number;
    numberNewPosts?: number;
    lengthNewChannel?: number;
    antennaHeight?: number;
    buildingHeight?: number;
    service: string;
    rniValue?: number;
    authResolucion?: string;
    authOtherMimicFile?: File;
}

export interface IMeasures {
    enviromentMeasures: IEnviromentalMeasures;
    contingencyMeasures: IContingencyMeasure[];
}

export interface IEnviromentalMeasures {
    planinng: IEnviromentalMeasure[],
    construction: IEnviromentalMeasure[],
    operation: IEnviromentalMeasure[],
    closing: IEnviromentalMeasure[],
}

export interface IEnviromentalMeasure {
    selected?: boolean;
    code?: string; //Code
    stage?: string; //value3
    activities?: string; //Value5
    component?: string; //Value4
    description?: string; //Value1
    preventiveMeasures?: string; //Name
    frecuency?: string; //Value7
    verification?: string; //Value6
}

export interface IContingencyMeasure {
    selected?: boolean,
    code?: string,
    risk?: string,
    contingencyMeasure?: string;
}

export interface ISchedule {
    cronoBudget: ICronoBudget[];
}


export interface ICronoBudget {
    stage?: string;
    startDate?: string;
    endDate?: string;
    budget?: number;
}

export interface IAttachments {
    standars: File;
    seia: File;
    locationPlan: File;
    engineeringPlans: File;
    kmzFile?: File; //Aplica a Cableado
    photomontage?: File; //Aplica a antena
    preExistingInfrastructure: File;
    additionalFile?: File;
}