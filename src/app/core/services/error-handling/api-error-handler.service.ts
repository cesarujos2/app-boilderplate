import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../shared/services/ui/notification.service';
import { Router } from '@angular/router';
import { DASHBOARD_ROUTE_BRANCHES } from 'app/features/dashboard/pages/dashboard.routes';
import { AccountService } from 'app/features/auth/services/account/account.service';
import { ErrorModalService } from '@core/services';

export interface ApiErrorDetails {
    statusCode: number;
    message: string;
    userMessage: string;
    errors?: errorItem[];
    timestamp: Date;
    endpoint?: string;
}

interface errorItem {
  Key: string;
  Value: string[];
}

@Injectable({
    providedIn: 'root'
})
export class ApiErrorHandlerService {
    private readonly router = inject(Router); 
    private readonly notificationService = inject(NotificationService);
    private readonly accountService = inject(AccountService);    
    private readonly errorModalService = inject(ErrorModalService);

    /**
     * Maneja errores de API y muestra notificaciones apropiadas
     */
    handleApiError(error: HttpErrorResponse): ApiErrorDetails {
        const errorDetails = this.createErrorDetails(error);
        
        // Verificar si se puede mostrar modal para este status de error
        if (this.errorModalService.canShowModal(error.status)) {
            this.showErrorNotification(errorDetails);
        } else {
            console.debug(`Modal for error ${error.status} already active, skipping notification`);
        }
        
        return errorDetails;
    }

    /**
     * Crea los detalles del error basado en la respuesta HTTP
     */
    private createErrorDetails(error: HttpErrorResponse): ApiErrorDetails {
        const baseDetails: ApiErrorDetails = {
            statusCode: error.status,
            message: error.message,
            userMessage: this.getUserFriendlyMessage(error),
            errors: error.error?.MessageList,
            timestamp: new Date(),
            endpoint: error.url || undefined
        };

        return baseDetails;
    }

    /**
     * Obtiene un mensaje amigable para el usuario basado en el error
     */
    private getUserFriendlyMessage(error: HttpErrorResponse): string {
        // Si el servidor envía un mensaje específico
        if (error.error?.Message || error.error?.message) {
            console.warn('API Error:', error.error.message);
            return error.error.message || error.error.Message;
        }

        // Mensajes por código de estado HTTP
        switch (error.status) {
            case 0:
                return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
            case 400:
                return 'Los datos enviados no son válidos. Por favor, revisa la información.';
            case 401:
                return 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
            case 403:
                return 'No tienes permisos para realizar esta acción.';
            case 404:
                return 'El recurso solicitado no fue encontrado.';
            case 408:
                return 'La solicitud tardó demasiado tiempo. Inténtalo de nuevo.';
            case 429:
                return 'Demasiadas solicitudes. Espera un momento antes de intentar nuevamente.';
            case 500:
                return 'Error interno del servidor. Nuestro equipo ha sido notificado.';
            case 502:
            case 503:
            case 504:
                return 'El servidor no está disponible temporalmente. Inténtalo más tarde.';
            default:
                return 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.';
        }
    }    /**
     * Muestra la notificación de error al usuario
     */
    private showErrorNotification(errorDetails: ApiErrorDetails): void {
        const title = this.getErrorTitle(errorDetails.statusCode);

        // Marcar modal como activo
        this.errorModalService.showModal(errorDetails.statusCode);

        // Para errores críticos (500+), incluir información adicional
        const includeDetails = errorDetails.statusCode >= 500;
        const message = includeDetails
            ? `${errorDetails.userMessage}\n\nCódigo: ${errorDetails.statusCode}`
            : errorDetails.userMessage;

        const errorList = this.formatErrorList(errorDetails.errors);

        this.notificationService.showError(title, message, errorList).subscribe({
            next: (result) => {
                // Marcar modal como cerrado cuando el usuario lo cierre
                this.errorModalService.closeModal(errorDetails.statusCode);
                
                if (result?.confirmed) {
                    this.handleErrorAction(errorDetails);
                }
            },
            error: (notificationError) => {
                // También cerrar en caso de error
                this.errorModalService.closeModal(errorDetails.statusCode);
                console.error('Error showing notification:', notificationError);
            }
        });
    }

    /**
     * Obtiene el título apropiado para el error
     */
    private getErrorTitle(statusCode: number): string {
        if (statusCode >= 500) {
            return 'Error del Servidor';
        } else if (statusCode >= 400) {
            return 'Error en la Solicitud';
        } else if (statusCode === 0) {
            return 'Error de Conexión';
        } else {
            return 'Error Inesperado';
        }
    }

    /**
     * Maneja acciones adicionales basadas en el tipo de error
     */
    private handleErrorAction(errorDetails: ApiErrorDetails): void {
        switch (errorDetails.statusCode) {
            case 401:
                // Redirigir al login o limpiar sesión
                this.handleUnauthorizedError();
                break;
            case 403:
                // Manejar permisos insuficientes
                this.handleForbiddenError();
                break;
            case 429:
                // Implementar retry con backoff
                this.handleRateLimitError();
                break;
            default:
                // Log para análisis posterior
                this.logErrorForAnalysis(errorDetails);
                break;
        }
    }    /**
     * Maneja errores de autenticación (401)
     */
    private handleUnauthorizedError(): void {
        console.warn('Unauthorized access detected, executing logout...');
        
        // Limpiar todos los modales activos antes del logout
        this.errorModalService.clearAllModals();
          // Ejecutar logout
        this.accountService.forceLogout();
    }

    /**
     * Maneja errores de permisos (403)
     */
    private handleForbiddenError(): void {
        // Lógica para manejar permisos insuficientes
        this.router.navigate(DASHBOARD_ROUTE_BRANCHES.BASE.fullPath());
        console.warn('Insufficient permissions detected');
    }

    /**
     * Maneja errores de rate limiting (429)
     */
    private handleRateLimitError(): void {
        // Implementar lógica de retry con backoff exponencial
        console.warn('Rate limit exceeded, implementing backoff strategy');
    }

    /**
     * Registra errores para análisis posterior
     */
    private logErrorForAnalysis(errorDetails: ApiErrorDetails): void {
        // Aquí puedes enviar el error a un servicio de logging externo
        console.error('API Error logged for analysis:', {
            ...errorDetails,
            userAgent: navigator.userAgent,
            url: window.location.href
        });
    }
    /**
     * Verifica si un error debe ser manejado automáticamente
     */
    shouldHandleError(error: HttpErrorResponse): boolean {
        // No manejar errores que son parte del flujo normal
        const ignoredStatuses: number[] = [
            // Agregar códigos de estado que no requieren notificación automática
            // Ejemplo: 404 en búsquedas opcionales
        ];

        return !ignoredStatuses.includes(error.status);
    }    /**
     * Formatea la lista de errores para mostrar al usuario con Tailwind CSS
     */
    private formatErrorList(errors?: errorItem[]): string | undefined {
        if (!errors || !Array.isArray(errors) || errors.length === 0) {
            return undefined;
        }

        const errorItems = errors
            .filter(err => err && err.Key && err.Value)
            .map((err) => {
                const values = Array.isArray(err.Value) ? err.Value : [err.Value];
                const errorMessages = values
                    .filter(value => value && typeof value === 'string')
                    .map(value => value.trim())
                    .filter(value => value.length > 0);

                if (errorMessages.length === 0) return null;
                  return `
                    <div class="mb-2">
                        <div class="space-y-1">
                            ${errorMessages.map(msg => `
                                <div class="flex items-start gap-2 text-sm text-neutral-700 dark:text-white">
                                    <span class="text-emerald-500 mt-0.5">•</span>
                                    <span>${msg}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            })
            .filter(item => item !== null);

        return errorItems.length > 0 ? `<div class="space-y-1">${errorItems.join('')}</div>` : undefined;
    }
}
