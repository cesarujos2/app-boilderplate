import { Account } from "./account.interface";

export interface LoginResponse extends Account {
  requiredRole: boolean;
}

