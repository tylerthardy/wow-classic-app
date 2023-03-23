import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config';

@Injectable()
export class MaintenanceAuthGuard implements CanActivate {
  constructor(private appConfig: AppConfig, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.appConfig.maintenance) {
      this.router.navigate(['/maintenance']);
      return false;
    } else {
      return true;
    }
  }
}
