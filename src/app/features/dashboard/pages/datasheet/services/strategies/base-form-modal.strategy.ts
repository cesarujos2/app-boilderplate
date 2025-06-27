import { Injectable } from '@angular/core';
import { ProjectTypeAcronym } from '../../models/project-type.interface';
import { FormModalMode, FormModalConfig } from '../../models/form-modal.interface';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseFormModalStrategy {
  abstract getModalConfig(mode: FormModalMode): FormModalConfig;
  abstract canHandle(acronym: ProjectTypeAcronym): boolean;
}
