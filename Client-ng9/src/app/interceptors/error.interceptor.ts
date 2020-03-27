import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse, HTTP_INTERCEPTORS
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor() {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError(error => {
          if (error.status === 401) {
            return throwError(`${error.statusText} 💥`);
          }

          if (error instanceof HttpErrorResponse) {
            const applicationError = error.headers.get('Application-Error');
            if (applicationError) {
              return throwError(applicationError);
            }
          }

          let serverError = error.error;
          let modalStateErrors = null;

          if (serverError.errors && typeof serverError.errors === 'object') {
            modalStateErrors = Object.entries(serverError.errors)
              .reduce((acc, item: any) => {
                acc = [...acc, ...item[1]];
                return acc;
              }, []);
          }
          return throwError(modalStateErrors || (typeof serverError === 'object' ? Object.values(serverError) : serverError) || '💥 Something went wrong!');
        })
      );
  }
}


export const httpInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
];
