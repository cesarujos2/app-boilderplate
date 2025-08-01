import { Component, inject, OnInit, signal } from '@angular/core';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { rucValidator, peruvianDocumentValidator, DocumentType, VALIDATION_PATTERNS, NavigationService, ROUTE_KEYS } from '@core';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatSelect,
    MatOption,
    MatInput,
    MatButton,
    MatIcon,
    MatCheckbox
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly navigationService = inject(NavigationService);

  documentTypes = signal<DocumentType[]>([{
    value: 'DNI',
    label: 'Documento Nacional de Identidad'
  }, {
    value: 'CE',
    label: 'Carnet de Extranjería'
  }, {
    value: 'PASS',
    label: 'Pasaporte'
  }])

  form: FormGroup = this.fb.group({
    ruc: [null, [Validators.required, rucValidator()]],
    documentType: [null, Validators.required],
    documentNumber: [null, [Validators.required, peruvianDocumentValidator()]],
    rememberMe: [false],
    password: [null, [Validators.required, Validators.pattern(VALIDATION_PATTERNS.PASSWORD)]],
  });

  ngOnInit() {
    this.getLoginData();
  }

  onSubmit() {
    if (this.form.valid) {
      this.navigationService.navigateToRoute(ROUTE_KEYS.DASHBOARD_OVERVIEW);
      this.saveLoginData();
    } else {
      this.form.markAllAsTouched();
    }
  }

  toForgotPasswordPage() {
    this.navigationService.navigateToRoute(ROUTE_KEYS.AUTH_FORGOT_PASSWORD);
  }

  toRegisterPage(){
    this.navigationService.navigateToRoute(ROUTE_KEYS.AUTH_REGISTER);
  }

  private saveLoginData() {
    if (this.form.value.rememberMe) {
      localStorage.setItem('ruc', this.form.value.ruc);
      localStorage.setItem('documentType', this.form.value.documentType);
      localStorage.setItem('documentNumber', this.form.value.documentNumber);
      localStorage.setItem('rememberMe', this.form.value.rememberMe.toString());
    } else {
      localStorage.removeItem('ruc');
      localStorage.removeItem('documentType');
      localStorage.removeItem('documentNumber');
      localStorage.removeItem('rememberMe');
    }
  }

  private getLoginData() {
    const storedRuc = localStorage.getItem('ruc');
    const storedDocumentType = localStorage.getItem('documentType');
    const storedDocumentNumber = localStorage.getItem('documentNumber');
    const storedRememberMe = localStorage.getItem('rememberMe');

    this.form.patchValue({ ruc: storedRuc });
    this.form.patchValue({ documentType: storedDocumentType });
    this.form.patchValue({ documentNumber: storedDocumentNumber });
    this.form.patchValue({ rememberMe: storedRememberMe === 'true' });
  }
}
