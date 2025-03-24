import type { HttpInterceptorFn } from '@angular/common/http';
import { API_KEY } from '../environmant/env';

export const currencyApiInterceptor: HttpInterceptorFn = (req, next) => {
  req = req.clone({
    setHeaders: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return next(req);
};
