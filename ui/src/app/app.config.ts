import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable()
export class AppConfig {
  public apiUrl: string;

  constructor() {
    this.apiUrl = environment.apiUrl;
  }
}
