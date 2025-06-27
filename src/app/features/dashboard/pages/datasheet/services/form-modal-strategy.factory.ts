import { Injectable, inject } from '@angular/core';
import { ProjectTypeAcronym } from '../models/project-type.interface';
import { BaseFormModalStrategy } from './strategies/base-form-modal.strategy';
import { FtaFormModalStrategy } from './strategies/fta-form-modal.strategy';

@Injectable({
  providedIn: 'root'
})
export class FormModalStrategyFactory {
  private ftaStrategy = inject(FtaFormModalStrategy);

  private strategies: BaseFormModalStrategy[] = [
    this.ftaStrategy
    // Aquí se pueden agregar más estrategias para otros tipos de proyecto
  ];

  getStrategy(acronym: ProjectTypeAcronym): BaseFormModalStrategy | null {
    return this.strategies.find(strategy => strategy.canHandle(acronym)) || null;
  }

  getSupportedAcronyms(): ProjectTypeAcronym[] {
    const supportedAcronyms: ProjectTypeAcronym[] = [];
    
    this.strategies.forEach(strategy => {
      if (strategy instanceof FtaFormModalStrategy) {
        supportedAcronyms.push('FTA');
      }
      // Aquí se pueden agregar más verificaciones para otros tipos
    });
    
    return supportedAcronyms;
  }
}
