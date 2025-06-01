import { MatOption, MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AUTH_PATHS } from '../auth.routes';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatButton, MatIcon,
    MatLabel, MatError, MatFormField,
    MatInput, MatSelect, MatOption
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export default class RegisterComponent {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  documentTypes = signal([{
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
    ruc: [null, [Validators.required]],
    documentType: [null, Validators.required],
    documentNumber: [null, [Validators.required]],
    firstName: [null, [Validators.required, Validators.minLength(2)]],
    lastName: [null, [Validators.required, Validators.minLength(2)]],
    secondLastName: [null, [Validators.minLength(2)]],
    email: [null, [Validators.required, Validators.email]],
    phone: [null, [Validators.required, Validators.pattern(/^\d{9}$/)]],
    address: [null, [Validators.required, Validators.minLength(5)]],
    department: [null, [Validators.required]],
    province: [null, [Validators.required]],
    district: [null, [Validators.required]],
    password: [null, [Validators.required, Validators.minLength(8)]],
    confirmPassword: [null, [Validators.required, Validators.minLength(8)]],
  });

  onSubmit() {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
      this.toLogin();
    } else {
      console.error('Form is invalid');
    }
  }

  toLogin() {
    this.router.navigate(AUTH_PATHS.FULL.LOGIN())
  }
}
