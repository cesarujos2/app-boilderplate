import { NotificationService } from 'app/shared/services/ui/notification.service';
import { AUTH_ROUTE_BRANCHES } from './../auth.routes';
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { rucValidator } from '@shared/validators/peruvian/ruc.validator';
import { peruvianDocumentValidator } from '@shared/validators/peruvian/peruvian-doc.validator';
import { equalToValidator } from '@shared/validators/general/equal-to.validator';
import { LookupService } from '@shared/services';
import { GeopoliticalService } from '@shared/services/data/geopolitical.service';
import { Ubigeo } from '@shared/models/general/ubigeo.interface';
import { AccountService } from '../../services';

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
  private readonly lookupService = inject(LookupService);
  private readonly geopoliticalService = inject(GeopoliticalService);
  private readonly notificationService = inject(NotificationService);
  private readonly accountService = inject(AccountService);

  form: FormGroup = this.fb.group({
    documentNumber: [null, [Validators.required, rucValidator()]],
    contactDocumentTypeId: [null, Validators.required],
    contactDocumentNumber: [null, [Validators.required, peruvianDocumentValidator()]],
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

  documentTypes = this.lookupService.documentTypes;
  departments = this.geopoliticalService.departments;
  provinces = signal<Ubigeo[]>([]);
  districts = signal<Ubigeo[]>([]);

  onDepartmentChange(event: MatSelectChange) {
    const departmentId = event.value;
    this.geopoliticalService.listProvinces(departmentId).subscribe(provinces => {
      this.provinces.set(provinces);
      this.districts.set([]);
      this.form.get('province')?.setValue(null);
      this.form.get('district')?.setValue(null);
    });
  }

  onProvinceChange(event: MatSelectChange) {
    const provinceId = event.value;
    this.geopoliticalService.listDistricts(provinceId).subscribe(districts => {
      this.districts.set(districts);
      this.form.get('district')?.setValue(null);
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.notificationService.showConfirmation(
        'Confirmación', '¿Está seguro de que desea registrarse?'
      ).subscribe(confirmed => {
        if (confirmed) {
          this.accountService.registerUser(this.form.value).subscribe({
            next: (resp) => {
              this.notificationService.showSuccess('Registro exitoso', resp.message);
              this.toLogin();
            }
          });
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  toLogin() {
    this.router.navigate(AUTH_ROUTE_BRANCHES.LOGIN.fullPath())
  }
}
