import { AUTH_ROUTE_BRANCHES } from './../auth.routes';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { peruvianDocumentValidator } from '@validators/sync/peruvian/peruvian-doc.validator';
import { rucValidator } from '@validators/sync/peruvian/ruc.validator';
import { equalToValidator } from '@validators/sync/general/equal-to.validator';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatIcon,
    MatLabel,
    MatError,
    MatFormField,
    MatInput,
    MatSelect,
    MatOption
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
    ruc: [null, [Validators.required, rucValidator()]],
    documentType: [null, Validators.required],
    documentNumber: [null, [Validators.required, peruvianDocumentValidator()]],
    firstName: [null, [Validators.required, Validators.minLength(2)]],
    lastName: [null, [Validators.required, Validators.minLength(2)]],
    secondLastName: [null, [Validators.minLength(2)]],
    email: [null, [Validators.required, Validators.email]],
    phone: [null, [Validators.required, Validators.pattern(/^\d{9}$/)]],
    address: [null, [Validators.required, Validators.minLength(10)]],
    department: [null, [Validators.required]],
    province: [null, [Validators.required]],
    district: [null, [Validators.required]],
    password: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/)]],
    confirmPassword: [null, [Validators.required, equalToValidator('password')]],
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
    this.router.navigate(AUTH_ROUTE_BRANCHES.LOGIN.fullPath())
  }
}
