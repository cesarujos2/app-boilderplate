import { Component, computed, effect, inject, input, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { GeneralService } from '../../services/general.service';
import { FtaService } from '../../services/fta.service';
import { legalResult } from '../../validators/legalAsyncValidator';
import { CommonModule } from '@angular/common';
import { IDocumentType, IPersonType } from '../../interface/general';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormField, MatLabel, MatError,
    MatSelect, MatOption, MatInput
  ],
  templateUrl: './legal.component.html',
  styleUrl: './legal.component.scss'
})
export class LegalComponent implements OnInit {
  readonly generalService = inject(GeneralService);
  readonly ftaService = inject(FtaService);

  disableFields = input.required<boolean>();
  disabled = computed(() => this.disableFields());

  form = input.required<FormGroup<any>>()
  legalResult = toSignal(legalResult);

  initialData = computed(() => this.generalService.initialData());

  personTypesLegal: IPersonType[] = []
  documentTypesLegal: IDocumentType[] = []
  documentTypesContact: IDocumentType[] = []



  constructor() {
    this.setupInitialData();
  }
  ngOnInit(): void {
  }

  getDocumentTypeValue(controlName: string, typePerson: "N" | "J") {
    const value = this.form().get(controlName)?.value ?? "";
    if (typePerson == "J") {
      return this.documentTypesLegal.find(x => x.code == value)?.name ?? "";
    } else {
      return this.documentTypesContact.find(x => x.code == value)?.name ?? "";
    }
  }

  setupInitialData() {
    effect(() => {
      const data = this.initialData();
      if (data.documentTypes && data.documentTypes.length > 0 && data.personTypes && data.personTypes.length > 0) {
        this.personTypesLegal = data.personTypes?.filter(x => x.isLegalEntity) ?? []

        this.documentTypesLegal = data.documentTypes?.filter(x =>
          this.personTypesLegal.some(y => y.code === x.personTypeCode)) ?? []
        this.form().get('documentType')?.setValue(this.documentTypesLegal[0].code)

        this.documentTypesContact = data.documentTypes?.filter(x =>
          this.personTypesLegal.some(y => y.code !== x.personTypeCode)) ?? []
        this.form().get('contactDocumentType')?.setValue(this.documentTypesContact[0].code)
      }
    })
  }
}
