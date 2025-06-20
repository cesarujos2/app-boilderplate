import { Component, inject, OnInit, signal } from '@angular/core';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AUTH_ROUTE_BRANCHES } from '../auth.routes';
import { LookupService } from '@shared/services/lookup.service';
import { LoginStorageService } from '../../services/auth/login-storage.service';
import { rucValidator } from '@shared/validators/peruvian/ruc.validator';
import { peruvianDocumentValidator } from '@shared/validators/peruvian/peruvian-doc.validator';
import { DASHBOARD_ROUTE_BRANCHES } from 'app/features/dashboard/pages/dashboard/dashboard.routes';

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
  private readonly lookupService = inject(LookupService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly loginStorage = inject(LoginStorageService);

  documentTypes = this.lookupService.documentTypes;

  form: FormGroup = this.fb.group({
    documentNumber: [null, [Validators.required, rucValidator()]],
    contactDocumentTypeId: [null, Validators.required],
    contactDocumentNumber: [null, [Validators.required, peruvianDocumentValidator()]],
    rememberMe: [false],
    password: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/)]],
  });

  ngOnInit() {
    this.getLoginData();
  }

  onSubmit() {
    if (this.form.valid) {
      this.router.navigate(DASHBOARD_ROUTE_BRANCHES.BASE.fullPath());
      this.saveLoginData();
    } else {
      this.form.markAllAsTouched();
    }
  }

  toForgotPasswordPage() {
    this.router.navigate(AUTH_ROUTE_BRANCHES.FORGOT_PASSWORD.fullPath());
  }

  toRegisterPage() {
    this.router.navigate(AUTH_ROUTE_BRANCHES.REGISTER.fullPath());
  }

  private saveLoginData() {
    this.loginStorage.save(this.form);
  }

  private getLoginData() {
    const data = this.loginStorage.load();
    if (data) {
      this.form.patchValue(data);
    }
  }
}
