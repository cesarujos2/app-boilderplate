import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor para añadir credenciales de cookies a las peticiones HTTP
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Clonar la petición y añadir withCredentials para incluir cookies
  const authReq = req.clone({
    withCredentials: true
  });

  return next(authReq);
};
