export interface RegisterRequest {
  documentNumber: string;
  contactDocumentTypeId: number;
  contactDocumentNumber: string;
  firstName: string;
  lastName: string;
  secondLastName?: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  province: string;
  district: string;
  password: string;
  confirmPassword: string;
  url?: string;
}