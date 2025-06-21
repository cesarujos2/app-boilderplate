import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '@core/services/state/loading.service';

let activeRequests = 0;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingService = inject(LoadingService);
    
    // Incrementar contador de peticiones activas
    activeRequests++;

    // Iniciar loading si es la primera petición
    if (activeRequests === 1) {
        loadingService.startLoading();
    }

    return next(req).pipe(
        finalize(() => {
            // Decrementar contador de peticiones activas
            activeRequests--;

            // Detener loading si no hay más peticiones activas
            if (activeRequests === 0) {
                loadingService.stopLoading();
            }
        })
    );
};