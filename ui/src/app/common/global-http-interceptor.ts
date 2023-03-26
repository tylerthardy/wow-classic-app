import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, mergeMap, Observable, throwError } from 'rxjs';
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
    return from(this.authService.getToken()).pipe(
      mergeMap((token: string | undefined) => {
        if (!token) return throwError(() => 'undefined token');
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
