import { inject, Pipe, PipeTransform } from '@angular/core';
import { GeneralService } from '../services/general.service';

@Pipe({
  name: 'componentName',
  standalone: true
})
export class ComponentNamePipe implements PipeTransform {
  readonly generalService = inject(GeneralService)

  transform(code: string, isCode: boolean): string {
    return this.generalService.initialData().impactComponents?.find(x => x.code == code)?.name ?? code
  }

}
