import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { AUTH_ROUTE_BRANCHES } from '../auth.routes';
import { rucValidator } from '@shared/validators/peruvian/ruc.validator';
import { peruvianDocumentValidator } from '@shared/validators/peruvian/peruvian-doc.validator';
import { LookupService } from '@shared/services';

@Component({
  selector: 'app-forgot-password',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatOption,
    MatSelect,
    MatButton,
    MatIcon
],
  templateUrl: './forgot-password.page.html',
  styleUrl: './forgot-password.page.scss'
})
export default class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly lookupService = inject(LookupService);
  
  form: FormGroup = this.fb.group({
    documentNumber: [null, [Validators.required, rucValidator()]],
    contactDocumentTypeId: [null, Validators.required],
    contactDocumentNumber: [null, [Validators.required, peruvianDocumentValidator()]]
  });

  documentTypes = this.lookupService.documentTypes;

  onSubmit() {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
    } else {
      console.log('Form is invalid');
    }
  }

  toLoginPage(){
    this.router.navigate(AUTH_ROUTE_BRANCHES.LOGIN.fullPath());
  }

}
