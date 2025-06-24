import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, switchMap } from 'rxjs';
import { AccountService } from '../account/account.service';
import { RoleSelectionData } from '../../models/role-selection-modal/role-selection.interface';
import { ProfileCompletionModalComponent } from '../../components/profile-completion-modal/profile-completion-modal.component';
import { UpdateRoleRequest } from '../../models/account/update-account-request.interface';

@Injectable({
    providedIn: 'root'
})
export class RoleCompletionService {
    private readonly dialog = inject(MatDialog);
    private readonly accountService = inject(AccountService);

    private readonly availableRoles = ['legal', 'consultor'];

    /**
     * Maneja el flujo completo de completion de perfil
     */
    handleRoleCompletion(): Observable<boolean> {
        return this.openRoleSelectionModal().pipe(
            switchMap((result: RoleSelectionData) => {
                if (result) {
                    return this.updateUserRole(result);
                }
                throw new Error('No se seleccionó un rol');
            })
        );
    }

    /**
     * Abre el modal de selección de rol
     */
    private openRoleSelectionModal(): Observable<RoleSelectionData> {
        const dialogRef = this.dialog.open(ProfileCompletionModalComponent, {
            width: '450px',
            maxWidth: '90vw',
            disableClose: true,
            closeOnNavigation: true,
            data: {
                availableRoles: this.availableRoles,
                currentUser: this.accountService.getCurrentUser()
            }
        });

        return dialogRef.afterClosed();
    }

    /**
     * Actualiza el rol del usuario y hace login automático
     */
    private updateUserRole(role: RoleSelectionData): Observable<boolean> {
        const updateRequest: UpdateRoleRequest = {
            role: role.selectedRole,
            documentInscription: role.documentInscription
        };

        return this.accountService.updateRole(updateRequest).pipe(
            switchMap(() => {
                return this.accountService.refreshUserSession();
            })
        );
    }
}
