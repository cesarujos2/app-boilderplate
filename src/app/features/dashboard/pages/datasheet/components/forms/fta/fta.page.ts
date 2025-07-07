import { Component, computed, DestroyRef, effect, ElementRef, inject, model, OnInit, signal, viewChildren } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { AttachmentsComponent } from "./components/attachments/attachments.component";
import { ScheduleComponent } from "./components/schedule/schedule.component";
import { ContingencyComponent } from "./components/contingency/contingency.component";
import { EnvMeasuresComponent } from "./components/env-measures/env-measures.component";
import { TechDescComponent } from "./components/tech-desc/tech-desc.component";
import { ProjectDataComponent } from "./components/project-data/project-data.component";
import { LegalComponent } from "./components/legal/legal.component";
import { VerticalStepperComponent } from "./components/vertical-stepper/vertical-stepper.component";
import { FtaService } from "./services/fta.service";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IAttachments, IEnviromentalMeasures, IFTA, ILocalization, IMeasures, IPerson, IProjectInformation, ISchedule, ITechnicalDescription } from './models/fta.interface';
import { MAX_10MB, MAX_1MB, MAX_5MB, stepNames } from "./config/fta.config";
import { catchError, EMPTY, take } from "rxjs";
import { ConfirmModalComponent } from "./components/confirm-modal/confirm-modal.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { rucValidator } from "./validators/rucValidator";
import { legalAsyncValidator } from "./validators/legalAsyncValidator";
import { projectNameAsyncValidator } from "./validators/projectNameAsyncValidator";
import { selectedAtLeastOneValidator } from "./validators/selectedAtLeastOneValidator";
import { maxSizeValidator } from "./validators/maxSizeValidator";
import { VisorHtmlComponent } from "./components/visor-html/visor-html.component";
import { FormModalData, FormModalResult } from "../../../models";
import { LoadingService } from "@core/services";


@Component({
  selector: 'app-fta',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    VerticalStepperComponent,
    LegalComponent,
    ProjectDataComponent,
    TechDescComponent,
    EnvMeasuresComponent,
    ContingencyComponent,
    ScheduleComponent,
    AttachmentsComponent,
  ],
  templateUrl: './fta.page.html',
  styleUrl: './fta.page.scss'
})
export class FtaPage implements OnInit {
  readonly dialogrRef = inject(MatDialogRef<FtaPage, FormModalResult>);
  readonly dialog = inject(MatDialog)
  readonly ftaService = inject(FtaService);
  readonly fb = inject(FormBuilder);
  readonly loadingService = inject(LoadingService);

  sections = viewChildren<ElementRef<HTMLElement>>('section')

  sectionsVisible = model<number>(0)
  stepName = computed(() => stepNames[this.sectionsVisible()]);

  ftaForm: FormGroup<{ [key in keyof IFTA]: FormGroup<any> }>;
  
  readonly data = inject<FormModalData>(MAT_DIALOG_DATA);

  ftaData = signal<IFTA | null>(null);

  modeEdit = computed(() => this.data.mode === 'edit');

  ftaProjectType = signal<string>(this.data.projectTypeAcronym);

  isLoading = computed(() => this.loadingService.isLoading());

  private destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      this.sections().forEach((section, index) => {
        if (index == this.sectionsVisible()) {
          section.nativeElement.classList.remove("section--inactive")
          this.scrollToTop(section)
        } else {
          section.nativeElement.classList.add("section--inactive")
        }
      })
    });

    this.ftaForm = this.createFTAForm();
  }
  ngOnInit(): void {
    if(this.data.datasheetId){
      this.ftaService.getFtaData(this.data.datasheetId).pipe(
        take(1),
        catchError(() => {
          this.dialogrRef.close({
            success: false
          });
          return EMPTY;
        })
      ).subscribe(fta => {
        fta.isRaiseObs = this.modeEdit();
        this.ftaProjectType.set(fta.projectType);
        this.ftaForm.patchValue(fta);
        this.ftaData.set(fta);
        this.ftaForm.updateValueAndValidity();
        this.ftaForm.markAllAsTouched();
      })
    }
  }

  nextStep() {
    console.log(this.ftaForm.value);
    if (this.sectionsVisible() < this.sections().length - 1) {
      this.sectionsVisible.update(value => value + 1)
    }
  }

  prevStep() {
    if (this.sectionsVisible() > 0) {
      this.sectionsVisible.update(value => value - 1)
    }
  }

  finalize() {
    const dialog = this.dialog.open(ConfirmModalComponent, {
      width: "75%",
      minWidth: "320px",
      maxWidth: "700px",
      data: {
        title: "Declaración Jurada de Información Ambiental del Sector de Comunicaciones",
        message: `Por medio del presente formulario, declaro bajo juramento que la información proporcionada en este formulario de registro de fichas técnicas
          ambientales del sector de comunicaciones es precisa y veraz. Me comprometo formalmente a cumplir con todas las disposiciones legales y regulaciones
          ambientales aplicables, así como a implementar de manera diligente las medidas ambientales y sociales detalladas en este formulario. Reconozco
          que estas medidas están diseñadas para prevenir impactos ambientales adversos y abordar situaciones de contingencia, contribuyendo así a la
          sostenibilidad de nuestras operaciones. Estoy plenamente consciente de que cualquier falsedad en la información proporcionada puede acarrear
          consecuencias legales y administrativas. Este documento tiene carácter de declaración jurada, y estoy dispuesto a colaborar en cualquier
          verificación o auditoría que las autoridades competentes consideren necesarias.`,
        showCancelButton: true,
        showConfirmButton: true,
        icon: "add_task",
        iconColor: "blue"
      }
    })

    dialog.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result) {
          this.save();
        }
      })
  }

  save() {
    this.ftaService.registerFta(this.ftaForm.value as IFTA).pipe(
      take(1),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(x => {
      if (x && x.id) {
        this.dialog.open(ConfirmModalComponent, {
          width: "70%",
          minWidth: "320px",
          maxWidth: "400px",
          disableClose: true,
          closeOnNavigation: false,
          data: {
            title: "Ficha Registrada Correctamente",
            message: "Recuerde que las notificaciones se harán a los correos del consultor ambiental y el representante legal",
            showCancelButton: false,
            showConfirmButton: true,
            icon: "check",
            iconColor: "green",
            onConfirm: async () => {
              this.dialogrRef.close({
                success: true,
                data: this.ftaForm.value as IFTA
              });
            }
          }
        })
      }
    });
  }

  scrollToTop(section: ElementRef<HTMLElement>) {
    section?.nativeElement.scrollTo({ top: 0 })
  }

  close() {
    this.dialog.open(ConfirmModalComponent, {
      width: "75%",
      minWidth: "320px",
      maxWidth: "400px",
      data: {
        title: "¿Salir del formulario?",
        html: `<div>
        Si sales ahora, perderás toda la información ingresada.
        <strong>¿Estás seguro de que deseas salir?</strong>
        </div>`,
        showCancelButton: true,
        showConfirmButton: true,
        icon: "warning",
        iconColor: "red"
      }
    }).afterClosed().subscribe(x => {
      if(x){
        this.dialogrRef.close({
          success: false
        });
      }
    })
  }

  private createFTAForm(): FormGroup<{ [key in keyof IFTA]: any }> {
    return this.fb.group<{ [key in keyof IFTA]: any }>({
      id: null,
      projectType: this.data.projectTypeAcronym,
      isRaiseObs: this.modeEdit(),
      legalRepresentative: this.createPersonGroup(),
      projectInformation: this.projectInformationGroup(),
      technicalDescriptions: this.technicalDescriptionsGroup(),
      measures: this.environmentalImpactsGroup(),
      schedule: this.schecheduleGroup(),
      attachments: this.attachmentsGroups(),
      // consultant: this.createPersonGroup(),
    });
  }

  private createPersonGroup(): FormGroup<{ [key in keyof IPerson]: any }> {
    return this.fb.group<{ [key in keyof IPerson]: any }>({
      documentType: ['', Validators.required],
      documentNumber: ['', [Validators.required, rucValidator()]],
      contactDocumentType: ['', Validators.required],
      contactDocumentNumber: ['', Validators.required],
    }, {
      asyncValidators: [legalAsyncValidator(this.ftaService)]
    });
  }

  private projectInformationGroup(): FormGroup<{ [key in keyof IProjectInformation]: any }> {
    const form = this.fb.group<{ [key in keyof IProjectInformation]: any }>({
      projectName: ['',
        [Validators.required, Validators.maxLength(150)], [projectNameAsyncValidator(this.ftaService)]],
      objetive: ['', [Validators.required, Validators.maxLength(255)]],
      locations: this.fb.array([]),
      localization: this.fb.group<{ [key in keyof ILocalization]: any }>({
        registerType: ['FILE', Validators.required],
        file: [null],
        coordinatesUTM: this.fb.array([]),
        coordinatesGeo: this.fb.array([]),
      }),
      zoning: [null, Validators.required],
      area: [null],
      perimeter: [null],
      budget: [null, [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
      lifetime: [null, [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
    });
    if(this.modeEdit()){
      form.get('projectName')?.clearAsyncValidators();
    }

    return form;
  }

  private technicalDescriptionsGroup(): FormGroup {
    return this.fb.group<{ [key in keyof ITechnicalDescription]: any }>({
      infraestrutureType: ['', [Validators.required]],
      mimicryType: [''],
      aerialLength: [''],
      undergroundLength: [''],
      numberNewPosts: [''],
      lengthNewChannel: [''],
      antennaHeight: [''],
      buildingHeight: [''],
      service: ['', [Validators.required, Validators.maxLength(150)]],
      rniValue: [''],
      authResolucion: [''],
      authOtherMimicFile: [null],
    });
  }

  private environmentalImpactsGroup(): FormGroup<{ [key in keyof IMeasures]: any }> {
    return this.fb.group<{ [key in keyof IMeasures]: any }>({
      enviromentMeasures: this.fb.group<{ [key in keyof IEnviromentalMeasures]: any }>({
        planinng: this.fb.array([], [selectedAtLeastOneValidator('selected')]),
        construction: this.fb.array([], [selectedAtLeastOneValidator('selected')]),
        operation: this.fb.array([], [selectedAtLeastOneValidator('selected')]),
        closing: this.fb.array([], [selectedAtLeastOneValidator('selected')]),
      }),
      contingencyMeasures: this.fb.array([], [selectedAtLeastOneValidator('selected')]),
    })
  }

  private schecheduleGroup(): FormGroup<{ [key in keyof ISchedule]: any }> {
    return this.fb.group({
      cronoBudget: this.fb.array([])
    })
  }

  private attachmentsGroups(): FormGroup<{ [key in keyof IAttachments]: any }> {
    return this.fb.group<{ [key in keyof IAttachments]: any }>({
      standars: [null, [Validators.required, maxSizeValidator(MAX_1MB, 'application/pdf')]],
      seia: [null, [Validators.required, maxSizeValidator(MAX_1MB, 'application/pdf')]],
      locationPlan: [null, [Validators.required, maxSizeValidator(MAX_10MB, 'application/pdf')]],
      engineeringPlans: [null, [Validators.required, maxSizeValidator(MAX_10MB, 'application/pdf')]],
      photomontage: [null],
      kmzFile: [null],
      preExistingInfrastructure: [null, [Validators.required, maxSizeValidator(MAX_10MB, 'application/pdf')]],
      additionalFile: [null, [maxSizeValidator(MAX_5MB, 'application/pdf')]]
    })
  }

  getFormGroup(key: keyof IFTA): FormGroup<any> {
    return this.ftaForm.get(key) as FormGroup<any>;
  }

  getFormFormForm(form: any, key: string) {
    if (!(form instanceof FormGroup)) return null
    return form.get(key) as FormGroup
  }

  async showPreview() {
    const pdfUrl = await this.ftaService.previewPdf(this.ftaForm.value as IFTA);
    this.dialog.open(VisorHtmlComponent, {
      width: '85%',
      height: "85%",
      minWidth: "300px",
      maxWidth: '900px',
      data: { url: pdfUrl }
    })
  }
}

export interface FtaPageData {
  projectType: string;
  raiseObs: boolean;
  ftaId?: string | null;
}









