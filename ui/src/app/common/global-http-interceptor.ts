import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, mergeMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AppConfig } from '../config/app.config';

@Injectable()
export class GlobalHttpInterceptor implements HttpInterceptor {
  constructor(private appConfig: AppConfig, private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isWcaApiRequest(request)) {
      return this.getRequestWithCognitoAuth(request, next);
    }
    return next.handle(request);
  }

  private isWcaApiRequest(request: HttpRequest<any>): boolean {
    return request.headers && request.url.startsWith(this.appConfig.apiUrl);
  }

  private getRequestWithCognitoAuth(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.getAccessToken().pipe(
      catchError((err, caught) => {
        // FIXME: A bit of a hacky way to check error type
        if (err === 'No user session to obtain token') {
          return throwError(() => new Error('Unauthenticated WCA Request'));
        } else {
          console.error('Unhandled error while retrieving token fron authService', err);
          return throwError(() => err);
        }
      }),
      mergeMap((token: string | undefined) => {
        // FIXME: Unlikely state because token will rarely be undefined; see line 50 in AuthService
        if (!token) return throwError(() => new Error('Unauthenticated WCA Request'));
        return next.handle(
          request.clone({
            setHeaders: {
              Authorization: 'Bearer ' + token
            }
          })
        );
      })
    );
  }
}
