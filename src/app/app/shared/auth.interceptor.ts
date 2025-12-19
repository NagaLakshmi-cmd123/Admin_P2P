import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
//   const token = authService.getToken();

//   let updatedReq = req;

//   if (token) {
//     updatedReq = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//   }

//   return next(updatedReq);
// };
  // ❌ Do NOT attach token for login API
  if (req.url.includes('/api/auth/login')) {
    return next(req);
  }

  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};