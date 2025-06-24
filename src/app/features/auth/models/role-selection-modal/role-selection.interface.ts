import { Account } from "../account/account.interface";

export interface RoleSelectionData {
    selectedRole: string;
    documentInscription: File | null;
}

export interface ProfileCompletionModalData {
    availableRoles: string[];
    currentUser: Account;
}
