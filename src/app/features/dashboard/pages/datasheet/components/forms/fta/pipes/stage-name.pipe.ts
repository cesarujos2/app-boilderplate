import { inject, Pipe, PipeTransform } from '@angular/core';
import { GeneralService } from '../services/general.service';

@Pipe({
  name: 'stageName',
  standalone: true
})
export class StageNamePipe implements PipeTransform {

  readonly generalService = inject(GeneralService)

  transform(code: unknown): string {
    if (typeof code !== 'string' && typeof code !== 'number') return String(code);
    
    const stages = this.generalService.initialData()?.stages;
    return stages?.find(x => x.code == code)?.name ?? String(code);
  }

}
