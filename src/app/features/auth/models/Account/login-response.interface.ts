export interface LoginResponse {
  id: number;
  documentNumber: string;
  contactDocumentType: string;
  contactDocumentNumber: string;
  lastName: string;
  name: string;
  organizationName: string;
  phoneNumber: string;
  email: string;
  address: string;
  occupation: null;
  roles: string[];
  isAdmin: boolean;
}

