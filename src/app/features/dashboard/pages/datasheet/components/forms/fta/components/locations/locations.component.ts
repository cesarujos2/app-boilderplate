import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, signal, effect } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { take } from 'rxjs';
import { GeneralService } from '../../services/general.service';
import { IUbigeo } from '../../interface/general';
import { IGeopoliticalLocation } from '../../models/fta.interface';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormField, MatError, MatLabel, MatSelect, MatOption,
    MatMiniFabButton, MatIcon, MatIconButton,
    MatTooltip
  ],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.scss'
})
export class LocationsComponent implements OnInit {
  readonly generalService = inject(GeneralService)
  readonly fb = inject(FormBuilder)

  form = input.required<FormArray<any>>();
  formData = input<IGeopoliticalLocation[]>();
  ubigeoList = signal<{ provinceList: IUbigeo[], districtList: IUbigeo[] }[]>([]);

  constructor() {
    effect(() => {
      if (this.formData()) {
        this.initializeFormWithData();
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    this.form().push(this.fb.group({
      department: ['', [Validators.required]],
      province: ['', [Validators.required]],
      district: ['', [Validators.required]],
    }))

    this.ubigeoList.set([{ provinceList: [], districtList: [] }]);
  }

  get locationForms() {
    return this.form().controls as FormGroup[];
  }

  initializeFormWithData() {
    this.form().clear();
    this.ubigeoList.set([]);

    this.formData()?.forEach((data, index) => {
      const formGroup = this.fb.group({
        department: [data.department, [Validators.required]],
        province: [data.province, [Validators.required]],
        district: [data.district, [Validators.required]],
      });

      this.form().push(formGroup);
      this.ubigeoList.update(prev => {
        prev.push({ provinceList: [], districtList: [] });
        return prev;
      });

      this.loadProvinces(data.department, index);
      this.loadDistricts(data.province, index);
    });
  }

  loadProvinces(departmentId: string, index: number) {
    this.generalService.listProvinces(departmentId)
      .pipe(take(1))
      .subscribe(provinces => {
        this.ubigeoList.update(prev => {
          prev[index].provinceList = provinces;
          return prev;
        });
      });
  }

  loadDistricts(provinceId: string, index: number) {
    this.generalService.listDistricts(provinceId)
      .pipe(take(1))
      .subscribe(districts => {
        this.ubigeoList.update(prev => {
          prev[index].districtList = districts;
          return prev;
        });
      });
  }

  changeDepartment(event: MatSelectChange, form: FormGroup, index: number) {
    const value = event.value
    this.generalService.listProvinces(value)
      .pipe(take(1))
      .subscribe(x => {
        this.ubigeoList.update(prev => {
          prev[index].provinceList = x
          prev[index].districtList = []
          return prev
        })
        form.patchValue({
          department: value,
          province: "",
          district: ""
        })
      });
  }

  changeProvince(event: MatSelectChange, form: FormGroup, index: number) {
    const value = event.value
    this.generalService.listDistricts(value)
      .pipe(take(1))
      .subscribe(x => {
        this.ubigeoList.update(prev => {
          prev[index].districtList = x
          return prev
        })
        form.patchValue({
          province: value,
          district: ""
        })
      });
  }

  addLocationForm(event: MouseEvent) {
    event.preventDefault()
    if (this.form().valid) {
      this.form().push(this.fb.group({
        department: ['', [Validators.required]],
        province: ['', [Validators.required]],
        district: ['', [Validators.required]],
      }));
      this.ubigeoList.update(prev => {
        prev.push({ provinceList: [], districtList: [] })
        return prev
      })
    } else {
      this.form().markAllAsTouched()
    }
  }

  removeLocationForm(index: number) {
    this.form().removeAt(index);
    this.ubigeoList.update(prev => {
      prev.splice(index, 1)
      return prev
    })
  }
}
