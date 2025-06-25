import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ProjectType } from '../models/project-type.interface';
import { ProjectTypeSelectionModalComponent } from '../components/project-type-selection-modal/project-type-selection-modal.component';
import { ProjectTypeSelectionModalData, ProjectTypeSelectionModalResult } from '../models/project-type-selection-modal-data.interface';

@Injectable({
    providedIn: 'root'
})
export class ProjectTypeModalService {
    private dialog = inject(MatDialog); openProjectTypeSelectionModal(projectTypes: ProjectType[]): Observable<ProjectTypeSelectionModalResult | undefined> {
        const dialogRef = this.dialog.open<
            ProjectTypeSelectionModalComponent,
            ProjectTypeSelectionModalData,
            ProjectTypeSelectionModalResult
        >(ProjectTypeSelectionModalComponent, {
            width: '560px',
            maxWidth: '95vw',
            minWidth: '320px',
            disableClose: false,
            closeOnNavigation: true,
            hasBackdrop: true,
            backdropClass: 'modern-backdrop',
            autoFocus: false,
            restoreFocus: true,
            data: {
                projectTypes
            }
        });

        return dialogRef.afterClosed();
    }
}
