import { NgClass, NgFor } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, input, model, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoogleMap, MapMarker, MapPolyline } from '@angular/google-maps';
import { MatFabButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { distinctUntilChanged, Observable, Subject, take, takeUntil } from 'rxjs';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { UtmComponent } from "../utm/utm.component";
import { GeoComponent } from '../geo/geo.component';
import { GeneralService } from '../../services/general.service';
import { FtaService, IFeaturesFromFiles } from '../../services/fta.service';
import { ILocalization } from '../../models/fta.interface';
import { LoadResult, LoadResultValue } from '../../config/fta.config';
import { utmCoordResult } from '../../validators/UTMAsyncValidator';
import { geoCoordResult } from '../../validators/GEOAsyncValidator';

@Component({
  selector: 'app-localization',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass, NgFor,
    MatRadioGroup, MatRadioButton,
    MatIcon,
    MatFabButton,
    GoogleMap, MapMarker, MapPolyline,
    UtmComponent,
    GeoComponent
],
  templateUrl: './localization.component.html',
  styleUrl: './localization.component.scss'
})
export class LocalizationComponent implements OnInit, OnDestroy {
  gmap = viewChild.required(GoogleMap)

  readonly generalService = inject(GeneralService);
  readonly fb = inject(FormBuilder);
  readonly dialog = inject(MatDialog)
  readonly ftaService = inject(FtaService)
  private cdr = inject(ChangeDetectorRef)

  form = input.required<FormGroup<any>>();
  formData = input<ILocalization>();

  loadFileResult = signal<LoadResultValue>('')

  //Map Options
  lineOptions: google.maps.PolylineOptions = { strokeColor: '#a20909', strokeWeight: 2 };
  mapType = "satellite" as google.maps.MapTypeId;
  
  private destroy$ = new Subject<void>();
  // showMap = model(false);
  features = signal<{
    points: google.maps.LatLngLiteral[],
    polylines: Array<google.maps.LatLngLiteral[]>
  }>({ points: [], polylines: [] });

  constructor() {
    effect(() => {
      const initialData = this.generalService.initialData();
      if (initialData.googleApiKey) {
        this.loadGoogleMapsScript(initialData.googleApiKey);
      }
    });
  }

  ngOnInit(): void {
    this.addValidators();
    this.subscribeToResults(utmCoordResult);
    this.subscribeToResults(geoCoordResult);
    this.form().get('registerType')?.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.registerTypeChange();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToResults(result$: Observable<any>): void {
    result$.pipe(takeUntil(this.destroy$)).subscribe(x => {
      if (x?.validationResult.length === 0) {
        this.updateMap({
          points: x.pointsInPeru,
          polylines: [{ path: x.pointsInPeru }]
        });
      } 
    });
  }


  private loadGoogleMapsScript(apiKey: string): void {
    if (this.generalService.hasGoogleScript()) {
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.onload = () => {
      this.generalService.hasGoogleScript.set(true);
    };
    document.head.appendChild(script);
  }

  private addValidators() {
    if (this.form().get('registerType')?.value == 'FILE') {
      this.form().get('file')?.setValidators(Validators.required)
      this.form().get('file')?.updateValueAndValidity()
    } else {
      this.form().get('file')?.clearValidators()
      this.form().get('file')?.setValue(null)
      this.loadFileResult.set(LoadResult.BLANK)
    }

    if (this.form().get('registerType')?.value != 'UTM') {
      this.form().setControl('coordinatesUTM', this.fb.array([]));
    }

    if (this.form().get('registerType')?.value != 'GEO') {
      this.form().setControl('coordinatesGeo', this.fb.array([]));
    }
  }

  registerTypeChange() {
    this.addValidators();
    this.cdr.detectChanges();
  }

  kmzFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      target.value = '';

      if( file.type !== 'application/vnd.google-earth.kmz') {
        this.loadFileResult.set(LoadResult.INVALID);
        this.form().get('file')?.setValue(null);
        return;
      }

      this.ftaService.validateCoordinatesFile(file).pipe(take(1)).subscribe({
        next: res => {
          const errorMessages = res.errorMessages
          if (errorMessages.length > 0) {
            this.loadFileResult.set(LoadResult.INVALID)
            this.form().get('file')?.setValue(null);
            this.modalError(errorMessages)
          } else {
            this.loadFileResult.set(LoadResult.SUCCESS)
            this.form().get('file')?.setValue(file);

            this.ftaService.getPointsAndPolylineFromFile(file)
              .subscribe({
                next: x => {
                  this.updateMap(x)
                }
              })
          }
        },
        error: () => {
          this.loadFileResult.set(LoadResult.ERROR);
          this.form().get('file')?.setValue(null);
        }
      })
    } else {
      this.form().get('file')?.setValue(null);
      this.loadFileResult.set(LoadResult.BLANK)
    }
  }

  updateMap(features: IFeaturesFromFiles) {
    this.features.set({ points: features.points, polylines: features.polylines.map(x => x.path) })

    const bounds = new google.maps.LatLngBounds();
    if (features.maxPoint && features.minPoint) {
      bounds.extend(new google.maps.LatLng(features.minPoint.lat, features.minPoint.lng));
      bounds.extend(new google.maps.LatLng(features.maxPoint.lat, features.maxPoint.lng));
    } else {
      features.points.forEach(position => {
        bounds.extend(new google.maps.LatLng(position.lat, position.lng));
      });
    }

    this.gmap().fitBounds(bounds);

    if (((this.gmap().getZoom() ?? 0) > 18)) {
      this.gmap().googleMap?.setZoom(15);
    }
  }

  getResultClass(): { value: string, label: string } {
    switch (this.loadFileResult()) {
      case LoadResult.SUCCESS:
        return { value: 'valid', label: "KMZ Válido" };
      case LoadResult.INVALID:
        return { value: "invalid", label: "KMZ Inválido" };
      case LoadResult.BLANK:
        return { value: 'invalid', label: 'No se ha cargado KMZ' };
      case LoadResult.ERROR:
        return { value: 'error', label: 'Error al validar KMZ' };
      default:
        return { value: 'invalid', label: 'Cargar KMZ' };
    }
  }


  modalError(errs: string[]) {
    this.dialog.open(ConfirmModalComponent, {
      width: "80%",
      minWidth: "320px",
      maxWidth: "400px",
      closeOnNavigation: false,
      disableClose: true,
      data: {
        title: "Se han identificado errores",
        html: `<div class="d-flex gap-2 flex-wrap p-2" style="border-left: 3px solid #eeb600;">
              ${errs.map(x => `<div class="px-2 py-1">${x}</div>`).join('')}
            </div>`,
        icon: "warning",
        iconColor: "#eeb600",
        showConfirmButton: true
      }
    })
  }

  getFormArray(key: keyof ILocalization) {
    return this.form().get(key) as FormArray<any>;
  }
  
}