import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ApiErrorHandlerService } from '@shared/services/api-error-handler.service';

/**
 * Interceptor funcional para manejo de errores de API
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const apiErrorHandler = inject(ApiErrorHandlerService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (apiErrorHandler.shouldHandleError(error)) {
        const errorDetails = apiErrorHandler.handleApiError(error);
        
        if (isDevelopmentMode()) {
          logDetailedError(error, errorDetails, req);
        }
      }

      return throwError(() => error);
    })
  );
};

/**
 * Verifica si estamos en modo desarrollo
 */
function isDevelopmentMode(): boolean {
  try {
    return !(globalThis as any)?.environment?.production;
  } catch {
    return true; // Fallback a modo desarrollo si hay error
  }
}

/**
 * Log detallado para desarrollo
 */
function logDetailedError(
  error: HttpErrorResponse, 
  errorDetails: any, 
  request: any
): void {
  console.group(`🚨 API Error - ${error.status} ${error.statusText}`);
  console.error('Request:', {
    method: request.method,
    url: request.url,
    headers: request.headers,
    body: request.body
  });
  console.error('Response:', {
    status: error.status,
    statusText: error.statusText,
    error: error.error,
    headers: error.headers
  });
  console.error('Processed Error Details:', errorDetails);
  console.groupEnd();
}
