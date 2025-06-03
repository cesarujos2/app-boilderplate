
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { DocumentType } from '@models/general/document-type.interface';
import { peruvianDocumentValidator } from '@validators/sync/peruvian/peruvian-doc.validator';
import { rucValidator } from '@validators/sync/peruvian/ruc.validator';
import { AUTH_PATHS } from '../auth.routes';

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
  
  form: FormGroup = this.fb.group({
    ruc: [null, [Validators.required, rucValidator()]],
    documentType: [null, Validators.required],
    documentNumber: [null, [Validators.required, peruvianDocumentValidator()]]
  });

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

  onSubmit() {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
    } else {
      console.log('Form is invalid');
    }
  }

  toLoginPage(){
    this.router.navigate(AUTH_PATHS.FULL.LOGIN());
  }

}
