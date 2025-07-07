import { environment } from "@environments/environment";

export const stepNames: string[] = [
  'Datos Generales',
  'Datos del Proyecto',
  'Descripción Técnica',
  'Impactos y medidas de manejo socioambiental',
  'Medidas de contingencia',
  'Cronograma y Presupuesto de ejecución de las medidas de manejo ambiental',
  'Anexos',
]

export const urlAttachmentExample = `${environment.API.URL}/Home/FtaPDF?Id=fc2cdc4e-55bc-4225-a891-3434101f82d9`

//Blank, Success, Error, Not Found, Invalid
export const LoadResult = {
  BLANK: 'B',
  SUCCESS: 'S',
  ERROR: 'E',
  INVALID: 'I'
}
export type LoadResultKey = keyof typeof LoadResult;
export type LoadResultValue = (typeof LoadResult)[LoadResultKey];

export const STAGES = {
  planinng: { code: '001', label: 'Planificación' },
  construction: { code: '002', label: 'Construcción' },
  operation: { code: '003', label: 'Operación y mantenimiento' },
  closing: { code: '004', label: 'Cierre' },
}

export const ROLS = {
  legal: 'legal',
  consultant: 'consultor'
}

export const AdministeredType = {
  OPERATOR: "operador",
  PIP: "pip",
  CONSULTANT: "empresa_consultora"
}

export const RoleByAdministeredType = {
  [AdministeredType.OPERATOR]: [ROLS.legal],
  [AdministeredType.PIP]: [ROLS.legal],
  [AdministeredType.CONSULTANT]: [ROLS.consultant]
}

export const FTA_STATUS = {
  validated: "VALIDATED",
  forSignature: "FOR_SIGNATURE",
  presented: "PRESENTED",
  underReview: "UNDER_REVIEW",
  resolved: "RESOLVED",
}

export const FTA_PROYECT_TYPE = [
  { value: 'nuevo', label: "Proyecto Nuevo", acronym: "FTA" },
  // { value: 'curso', label: "Proyecto en curso", acronym: "FTAC" },
  // { value: 'mfta', label: "Modificación de ficha técnica", acronym: "MFTA" },
]

export const VALIDATE_NUMBER ='^[0-9]+$'
export const VALIDATE_DECIMAL ='^[0-9]+(\.[0-9]{1,2})?$'
export const EXTENSION_UBICACION_PERMIIDA = "kmz"
export const MAX_1MB = 1024 * 1024;
export const MAX_5MB = 5 * 1024 * 1024;
export const MAX_10MB = 10 *1024 * 1024;
