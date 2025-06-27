import { Injectable } from '@angular/core';
import { ProjectTypeAcronym } from '../../models/project-type.interface';
import { FormModalMode, FormModalConfig } from '../../models/form-modal.interface';
import { BaseFormModalStrategy } from './base-form-modal.strategy';
import { FtaFormModalComponent } from '../../components/forms/fta-form-modal/fta-form-modal.component';

@Injectable({
  providedIn: 'root'
})
export class FtaFormModalStrategy extends BaseFormModalStrategy {
  
  canHandle(acronym: ProjectTypeAcronym): boolean {
    return acronym === 'FTA';
  }

  getModalConfig(mode: FormModalMode): FormModalConfig {
    return {
      component: FtaFormModalComponent,
      width: '90%',
      maxWidth: '70vw',
      minWidth: '320px',
      height: '95vh',
      maxHeight: '95vh',
      disableClose: true,
      closeOnNavigation: true
    };
  }
}
