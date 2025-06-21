import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class LoginStorageService {
  private readonly STORAGE_KEY = 'loginRemembered';

  save(form: FormGroup): void {
    if (form.value.rememberMe) {
      const formValue = { ...form.value };
      delete formValue.password; // No guardar la contraseña
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(formValue));
    } else {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  load(): Partial<any> | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }
}
