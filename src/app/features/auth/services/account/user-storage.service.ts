import { Account } from "../../models/Account/account.interface";
import { Injectable } from "@angular/core";

export interface IUserStorageService {
  setUser(account: Account): void;
  getUser(): Account | null;
  removeUser(): void;
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageUserService implements IUserStorageService {
  private readonly key = 'currentUser';

  setUser(account: Account): void {
    localStorage.setItem(this.key, JSON.stringify(account));
  }

  getUser(): Account | null {
    const account = localStorage.getItem(this.key);
    return account ? JSON.parse(account) : null;
  }

  removeUser(): void {
    localStorage.removeItem(this.key);
  }
}
