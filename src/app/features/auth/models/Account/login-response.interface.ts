import { Account } from "./account.interface";

export interface LoginResponse extends Account {
  requiresProfileCompletion: boolean;
}

