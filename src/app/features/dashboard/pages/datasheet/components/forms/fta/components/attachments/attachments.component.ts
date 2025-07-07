import { infraestrutureTypesCode } from './../tech-desc/tech-desc.component';
import { CommonModule, NgClass } from '@angular/common';
import { Component, DestroyRef, effect, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FtaService } from '../../services/fta.service';
import { IAttachments, IFTA } from '../../models/fta.interface';
import { environment } from '@environments/environment';
import { VisorHtmlComponent } from '../visor-html/visor-html.component';
import { MAX_10MB, MAX_5MB, urlAttachmentExample } from '../../config/fta.config';
import { maxSizeValidator } from '../../validators/maxSizeValidator';
import { kmzFileAsyncValidator } from '../../validators/kmzFileAsyncValidator';

@Component({
  selector: 'app-attachments',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule, MatIcon,
    MatTooltip
  ],
  templateUrl: './attachments.component.html',
  styleUrl: './attachments.component.scss'
})
export class AttachmentsComponent implements OnInit {
  readonly ftaService = inject(FtaService);
  readonly dialog = inject(MatDialog);

  ftaForm = input.required<FormGroup<{ [key in keyof IFTA]: FormGroup<any> }>>();

  infrastructureTypeCode = signal(null);
  isFileLocalizationType = signal(false);

  urlStandards: string = `${environment.API.URL}/Attachment/DownloadStandards`;
  urlSeia: string = `${environment.API.URL}/Attachment/DownloadSeia`;

  private destroyRef = inject(DestroyRef);


  infraestrutureTypesCode = infraestrutureTypesCode;

  get form(): FormGroup<{ [key in keyof IAttachments]: any }> {
    return this.ftaForm().get('attachments') as FormGroup<{ [key in keyof IAttachments]: any }>;
  }

  get registerType() {
    return this.ftaForm().get('projectInformation')?.get('localization')?.get('registerType')
  }

  constructor() {
    effect(() => {
      this.infrastructureTypeCode();
      this.isFileLocalizationType();
      this.setValidators();
    })
  }


  ngOnInit(): void {
    this.isFileLocalizationType.set(this.registerType?.value == 'FILE');
    this.infraestructureTypeChange();
    this.localizationTypeChange();
  }

  documentInputChange(event: Event, key: keyof IAttachments) {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      this.form.get(key)?.setValue(file);
    } else {
      this.form.get(key)?.setValue(null);
    }
  }

  getClass(control: any, optional?: boolean) {
    if (optional && !control?.value) return 'optional'
    if (control?.hasError('serverError')) return 'error'
    return control.valid ? 'valid' : 'invalid'
  }

  getText(control: any, fileType: string) {
    const fileName = control?.value?.name ?? `Subir archivo ${fileType}`;
    if (!control.errors || typeof control.errors !== 'object') {
      const [name, ext] = fileName.split(/(?=\.[^.]+$)/);
      return name.length > 20 ? `${name.substring(0, 20)}...${ext ?? ''}` : fileName;
    };
    const errors = Object.keys(control.errors);
    if (errors.includes('required')) return `Archivo ${fileType} requerido`;
    if (errors.includes('invalidFile')) return `Archivo ${fileType} inválido`;
    if (errors.includes('maxSizeExceeded')) {
      return `Error: Máximo ${control.errors.maxSizeExceeded?.size}MB`;
    }
    if (errors.includes('kmzInvalid')) return 'KMZ en área restringida';
    if (errors.includes('serverError')) return `Error: No se pudo procesar ${fileType}`;
    return 'Error desconocido';
  }

  seeAtachmentExample() {
    this.dialog.open(VisorHtmlComponent, {
      width: '85%',
      height: "85%",
      minWidth: "300px",
      maxWidth: '900px',
      data: { url: urlAttachmentExample }
    });
  }

  infraestructureTypeChange() {
    this.ftaForm().get('technicalDescriptions')?.get('infraestrutureType')?.valueChanges
      .pipe(
        debounceTime(50),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(x => {
        if (x) {
          this.infrastructureTypeCode.set(x);
        }
      })
  }

  localizationTypeChange() {
    this.ftaForm().get('projectInformation')?.get('localization')?.get('registerType')?.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(x => {
        this.isFileLocalizationType.set(x && x == 'FILE')
      })
  }

  setValidators() {
    const kmzControl = this.form.get('kmzFile')
    const photomontage = this.form.get('photomontage')
    if (this.infrastructureTypeCode() == infraestrutureTypesCode.wiring) {
      photomontage?.setValue(null);
      photomontage?.clearValidators();
      if (!this.isFileLocalizationType()) {
        kmzControl?.setValidators([Validators.required, maxSizeValidator(MAX_5MB, 'application/vnd.google-earth.kmz')])
        kmzControl?.setAsyncValidators([kmzFileAsyncValidator(this.ftaService)]);
      } else {
        kmzControl?.setValue(null);
        kmzControl?.clearValidators();
        kmzControl?.clearAsyncValidators();
      }
      kmzControl?.updateValueAndValidity();
      photomontage?.updateValueAndValidity();
    }

    if (this.infrastructureTypeCode() && this.infrastructureTypeCode() !== infraestrutureTypesCode.wiring) {
      kmzControl?.setValue(null);
      kmzControl?.clearValidators();
      kmzControl?.clearAsyncValidators();
      photomontage?.setValidators([Validators.required, maxSizeValidator(MAX_10MB, 'application/pdf')])
      photomontage?.updateValueAndValidity();
      kmzControl?.updateValueAndValidity();
    }
  }
}
