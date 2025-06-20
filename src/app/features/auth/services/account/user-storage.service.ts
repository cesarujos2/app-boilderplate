import { Account } from 'app/core/models/api/Account/account.interface';

export interface IUserStorageService {
  setUser(account: Account): void;
  getUser(): Account | null;
  removeUser(): void;
}

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
