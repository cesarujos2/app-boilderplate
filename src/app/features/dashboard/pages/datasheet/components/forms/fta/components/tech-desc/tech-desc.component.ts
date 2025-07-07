import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatError, MatFormField, MatLabel, MatOption, MatSelect } from '@angular/material/select';
import { distinctUntilChanged, take } from 'rxjs';
import { GeneralService } from '../../services/general.service';
import { FtaService } from '../../services/fta.service';
import { IFTA } from '../../models/fta.interface';
import { IInfraestructureRules, IMaster } from '../../interface/general';
import { maxSizeValidator } from '../../validators/maxSizeValidator';
import { MAX_10MB } from '../../config/fta.config';

@Component({
  selector: 'app-tech-desc',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf, NgClass,
    MatSelect, MatOption, MatLabel, MatError, MatFormField, MatInput,
    MatIcon, MatFabButton
  ],
  templateUrl: './tech-desc.component.html',
  styleUrl: './tech-desc.component.scss'
})
export class TechDescComponent implements OnInit {
  readonly generalService = inject(GeneralService);
  readonly ftaService = inject(FtaService);
  readonly cdr = inject(ChangeDetectorRef)

  ftaForm = input.required<FormGroup<{ [key in keyof IFTA]: FormGroup<any> }>>();
  disableFields = input.required<boolean>();
  zoning = signal<IMaster | null>(null);


  rules = signal<IInfraestructureRules>({
    mimicryTypes: [],
    showMimicryList: true,
    showRooftopFields: true,
    showWiringFields: true
  });

  infraestrutureTypesCode = infraestrutureTypesCode;
  mimicryGeneralTypes = mimicryGeneralTypes;
  zoningValues = zoningValues;

  maxAerialLength = signal(0);
  maxNewPosts = computed(() => Math.ceil(this.maxAerialLength() / 40));

  maxAntennaHeight = signal(0);
  minAntennaHeight = signal(0)
  minBuildingHeight = signal(0);
  maxBuildingHeight = signal(0);

  constructor() { }
  ngOnInit(): void {
    this.ftaForm()?.get('projectInformation')?.get('zoning')?.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(x => {
      const zoning = this.generalService.initialData().zoningTypes?.find(a => a.code == x)
      if (zoning) this.zoning.set(zoning);
      this.infraestrutureChange();
    });

    this.form.get('infraestrutureType')?.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(() =>{
      this.infraestrutureChange();
    });

    this.form.get('mimicryType')?.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(x => this.mimicryTypeChange());
  }

  get form() {
    return this.ftaForm().get('technicalDescriptions') as FormGroup<any>;
  }

  getValue(key: string) {
    return this.form.get(key)?.value
  }

  getRules() {
    if (this.zoning() && this.getValue('infraestrutureType')?.length > 0) {
      this.ftaService.getInfraestructureRules(this.zoning()?.code ?? "", this.getValue('infraestrutureType'))
        .pipe(take(1))
        .subscribe(x => this.rules.set(x))
    }
  }

  infraestrutureChange() {
    this.resetForm();
    this.getRules();
    this.addInfraestructureValidators();
  }

  resetForm() {
    this.form.enable();
    this.clearAllValues(['infraestrutureType', 'service']);
    this.clearAllValidators(['infraestrutureType', 'service']);
    this.updateAndValidityAll(['infraestrutureType', 'service']);
  }

  addInfraestructureValidators() {
    const infraestrutureType = this.getValue('infraestrutureType');
    const isWiring = infraestrutureType == this.infraestrutureTypesCode.wiring;
    if (!this.zoning()) {
      this.form.setValidators(requiredZoningValidator(this.zoning()));
      this.disableControlsByInfraestructure(isWiring);
    } else if (isWiring) {
      this.form.setValidators([wiringValidator()]);
      this.maxAerialLength.set(this.zoning()?.value1 == '1' ? 2000 : 6000)
      this.form.get('aerialLength')?.addValidators([Validators.min(0), Validators.max(this.maxAerialLength())]);
      this.form.get('undergroundLength')?.addValidators([Validators.min(0), Validators.max(4000)]);
      this.form.get('numberNewPosts')?.addValidators([Validators.min(0), Validators.max(this.maxNewPosts())]);
      this.form.get('lengthNewChannel')?.addValidators([Validators.min(0), Validators.max(4000)]);
    } else {
      this.form.get('rniValue')?.addValidators(
        [Validators.required, Validators.max(5), Validators.min(0.000001), Validators.pattern(/^\d+(\.\d{1,6})?$/)]
      )
      this.form.get('antennaHeight')?.addValidators([Validators.required]);
      if (infraestrutureType == infraestrutureTypesCode.radiodifusion) {
        this.form.get('authResolucion')?.addValidators([Validators.required, Validators.maxLength(20)])
      } else {
        this.form.get('mimicryType')?.addValidators([Validators.required]);
        if (infraestrutureType == infraestrutureTypesCode.rooftop) {
          this.form.get('buildingHeight')?.addValidators([Validators.required])
        }
      }
    }
    this.updateAndValidityAll(['infraestrutureType', 'service']);
  }

  mimicryTypeChange() {
    const infra = this.getValue('infraestrutureType');
    const code = this.getValue('mimicryType');
    const isUrban = this.zoning()?.value1 === zoningValues.URBAN;
    const mimicry = this.rules().mimicryTypes.find(x => x.code === code);
    const getVal = (d: number) => isUrban ?
      code === mimicryGeneralTypes.WHITHOUT ? d : Number(mimicry?.value2)
      : infra === infraestrutureTypesCode.greenfield ? 999 : d;

    const authOtherMimicFile = this.form.get('authOtherMimicFile');
    authOtherMimicFile?.setValidators(mimicryGeneralTypes.OTHER.includes(code) && isUrban ? [Validators.required, maxSizeValidator(MAX_10MB, 'application/pdf')] : null);
    !mimicryGeneralTypes.OTHER.includes(code) && authOtherMimicFile?.setValue(null);

    if (infra === infraestrutureTypesCode.greenfield || infra === infraestrutureTypesCode.pole) {
      const [defaultVal, min] = infra === infraestrutureTypesCode.greenfield ? [30, 15.01] : [15, 0.01];
      this.maxAntennaHeight.set(getVal(defaultVal));
      this.minAntennaHeight.set(min);
    }

    else if (infra === infraestrutureTypesCode.rooftop) {
      if (isUrban) {
        const config = code === mimicryGeneralTypes.WHITHOUT
          ? { maxAntennaHeight: 4, minBuildingHeight: 24, minAntennaHeight: 0.01, maxBuildingHeight: 1e6 }
          : { maxAntennaHeight: 6, minAntennaHeight: 0.01, maxBuildingHeight: 24, minBuildingHeight: 0.01 };
        Object.entries(config).forEach(([k, v]) => (this as any)[k].set(v));
        if (code !== mimicryGeneralTypes.WHITHOUT) this.form.setValidators([ratioValidator('antennaHeight', 'buildingHeight', 0.5)]);
        this.form.get('buildingHeight')?.setValidators([Validators.max(this.maxBuildingHeight()), Validators.min(this.minBuildingHeight())]);
      }
      else {
        [this.minBuildingHeight, this.minAntennaHeight].forEach(s => s.set(0.01));
        [this.maxAntennaHeight, this.maxBuildingHeight].forEach(s => s.set(999));
        this.form.get('buildingHeight')?.setValidators([Validators.min(this.minBuildingHeight())]);
      }
    }

    this.form.get('antennaHeight')?.setValidators([Validators.max(this.maxAntennaHeight()), Validators.min(this.minAntennaHeight())]);
    this.addInfraestructureValidators();
  }

  updateAndValidityAll(exceptions: string[] = []) {
    Object.keys(this.form.controls).forEach(field => {
      if (exceptions.includes(field)) return;
      const control = this.form.get(field);
      control?.updateValueAndValidity();
    });

    this.form.updateValueAndValidity()
  }

  clearAllValidators(exeptions: string[] = []) {
    Object.keys(this.form.controls).forEach(field => {
      if (exeptions.includes(field)) return;
      const control = this.form.get(field);
      control?.clearValidators();
    });
    this.form.clearValidators()
  }

  disableControlsByInfraestructure(isWiring: boolean = true) {
    if (isWiring) {
      wiringControlNames.forEach(x => {
        this.form.get(x)?.disable()
      })
    } else {
      antennaControlsNames.forEach(x => {
        this.form.get(x)?.disable()
      })
    }
  }

  clearAllValues(exceptions: string[] = []) {
    Object.keys(this.form.controls).forEach(field => {
      if (exceptions.includes(field)) return;
      const control = this.form.get(field);
      control?.setValue(null);
    });
  }

  otherMimycryFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      this.form.get('authOtherMimicFile')?.setValue(file);
      this.form.get('authOtherMimicFile')?.updateValueAndValidity();
    }
  }

  getInfraestructureTypeValue() {
    return this.generalService.initialData().infraestructureTypes?.find(x => x.code == this.getValue('infraestrutureType'))?.name ?? "";
  }

}

export const infraestrutureTypesCode = {
  radiodifusion: "radio",
  wiring: "cableado",
  greenfield: 'greenfield',
  pole: "poste",
  rooftop: 'rooftop',
}

export const zoningValues = {
  RURAL: '0',
  URBAN: '1'
}

const mimicryGeneralTypes = {
  WHITHOUT: 'SM',
  OTHER: ['poste_99', 'greenfield_99', 'rooftop_99']
}


function wiringValidator(): ValidatorFn {
  return (form: AbstractControl) =>
    wiringControlNames.some(i => Number(form.get(i)?.value) > 0) ? null : { wiring: true };
}


function requiredZoningValidator(zoning: IMaster | null): ValidatorFn {
  return (): { [key: string]: any } | null => {
    if (!zoning) { return { zoningRequired: true } }
    return null
  }
}

function ratioValidator(controlName1: string, controlName2: string, ratio: number): ValidatorFn {
  return (form: AbstractControl): { [key: string]: any } | null => {
    const [value1, value2] = [form.get(controlName1)?.value, form.get(controlName2)?.value];
    return value1 && value2 && Number(value1) / Number(value2) > ratio ? { ratio: true } : null;
  };
}

const wiringControlNames = ['aerialLength', 'undergroundLength', 'numberNewPosts', 'lengthNewChannel'];
const antennaControlsNames = ['antennaHeight', 'buildingHeight', 'authResolucion', 'mimicryType', 'rniValue']