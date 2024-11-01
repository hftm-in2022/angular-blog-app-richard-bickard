import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Http request:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
  });

  return next(req).pipe(
    tap({
      next: (event) => {
        console.log('HTTP response:', {
          url: req.url,
          event,
        });
      },
      error: (error) => {
        console.error('HTTP Request error:', {
          url: req.url,
          status: error.status,
          message: error.message,
        });
      },
    }),
  );
};
