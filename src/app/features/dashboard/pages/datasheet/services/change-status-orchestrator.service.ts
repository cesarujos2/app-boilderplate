import { DatasheetFormModalService } from './datasheet-form-modal.service';
import { Injectable, inject } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { DatasheetRepository } from './datasheet.repository';
import { NotificationService } from '@shared/services/ui';
import { PasswordConfirmationModalService } from './password-confirmation-modal.service';
import { Datasheet, IChangeStatus, IChangeStatusResponse, RequestStatus } from '../models/datasheet.interface';

/**
 * Servicio simple para orquestar cambios de estado
 * Maneja la lógica de confirmaciones y contraseñas
 */
@Injectable({
    providedIn: 'root'
})
export class ChangeStatusOrchestratorService {
    private readonly repository = inject(DatasheetRepository);
    private readonly notificationService = inject(NotificationService);
    private readonly passwordModalService = inject(PasswordConfirmationModalService);
    private readonly datasheetFormModalService = inject(DatasheetFormModalService);

    /**
     * Aplica una transición de estado simple (con confirmación)
     */
    applyValidatedTransition(datasheet: Datasheet, status: RequestStatus): Observable<IChangeStatusResponse> {
        const message = `¿Está seguro que desea ${status.transitionName}?`;

        return this.notificationService.showConfirmation(
            'Confirmar',
            message
        ).pipe(
            switchMap(result => {
                if (result?.confirmed) {
                    const request: IChangeStatus = {
                        id: datasheet.idHashed,
                        status: datasheet.fitacStatus
                    };
                    return this.repository.changeStatus(request).pipe(
                        switchMap(resp => {
                            if (resp.success) {
                                this.notificationService.showInfo("Éxito", `Se ha procedido a enviar a firma`);
                            }
                            return of(resp);
                        })
                    );
                }

                return of({
                    success: false,
                    status: datasheet.fitacStatus,
                    message: 'Operación cancelada por el usuario'
                });
            })
        );
    }

    /**
     * Aplica una transición que requiere contraseña
     */
    applyForSignatureTransition(datasheet: Datasheet, status: RequestStatus, customMessage?: string): Observable<IChangeStatusResponse> {
        const message = customMessage || `Ingrese su contraseña:`;

        return this.passwordModalService.requestPassword(
            'Confirmación Requerida',
            message
        ).pipe(
            switchMap(result => {
                if (result?.confirmed && result.password) {
                    const request: IChangeStatus = {
                        id: datasheet.idHashed,
                        status: status.key,
                        password: result.password
                    };
                    return this.repository.changeStatus(request).pipe(
                        switchMap(resp => {
                            if (resp.success) {
                                this.notificationService.showInfo("Éxito", 'Se ha procedido a presentar al MTC');
                                return of(resp);
                            }
                            return this.applyForSignatureTransition(datasheet, status, resp.message || 'Error al cambiar el estado');
                        })
                    );
                }

                return of({
                    success: false,
                    status: datasheet.fitacStatus,
                    message: 'Operación cancelada por el usuario'
                });
            })
        );
    }

    applyModForSignatureTransition(datasheet: Datasheet, modIndex: number): Observable<IChangeStatusResponse> {
        const message = `Ingrese su contraseña para firmar la actualización:`;

        return this.passwordModalService.requestPassword(
            'Confirmación Requerida',
            message
        ).pipe(
            switchMap(result => {
                if (result?.confirmed && result.password) {
                    const request: IChangeStatus = {
                        id: datasheet.idHashed,
                        status: datasheet.datasheetMods[modIndex].fitacStatus,
                        idMod: datasheet.datasheetMods[modIndex].id,
                        password: result.password
                    };
                    return this.repository.changeStatus(request).pipe(
                        switchMap(resp => {
                            if (resp.success) {
                                this.notificationService.showInfo("Éxito", `Se ha procedido a presentar la modificación`);
                            }
                            return of(resp);
                        })
                    );
                }

                return of({
                    success: false,
                    status: datasheet.fitacStatus,
                    message: 'Operación cancelada por el usuario'
                });
            })
        );
    }

    /**
     * Aplica transición para el estado RESOLVED (requiere abrir FTA)
     */
    applyResolvedTransition(datasheet: Datasheet): Observable<IChangeStatusResponse> {
        return this.datasheetFormModalService.openFormModal(datasheet.projectType, 'edit', datasheet.idHashed).pipe(
            switchMap(result => {
                if (result?.success) {
                    return of({
                        success: true,
                        status: datasheet.fitacStatus
                    });
                }

                return of({
                    success: false,
                    status: datasheet.fitacStatus,
                    message: 'Operación cancelada por el usuario'
                });
            })
        );
    }

    /**
     * Determina qué tipo de transición aplicar según el estado actual y destino
     */
    applyTransition(datasheet: Datasheet, status: RequestStatus): Observable<IChangeStatusResponse> {
        // Definir qué estados requieren contraseña
        const passwordRequiredStates = ['FOR_SIGNATURE'];

        // Si es transición a Validated, usar el flujo es
        if (status.key === 'VALIDATED') {
            return this.applyValidatedTransition(datasheet, status);
        }

        // Si el estado destino requiere contraseña
        if (passwordRequiredStates.includes(status.key)) {
            return this.applyForSignatureTransition(datasheet, status);
        }

        // Si el estado está resuelto, levantar observaciones
        if (status.key === 'RESOLVED') {
            return this.applyResolvedTransition(datasheet);
        }

        return of({
            success: false,
            status: datasheet.fitacStatus,
            message: `No se ha definido un flujo de transición para el estado: ${status}`
        });
    }
}