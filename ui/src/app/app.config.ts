import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable()
export class AppConfig {
  public apiUrl: string;
  public discordUrl: string;
  public maintenance: boolean;
  public addonDownloadUrl: string;

  constructor() {
    this.apiUrl = environment.apiUrl;
    this.discordUrl = environment.discordUrl;
    this.maintenance = environment.maintenance;
    this.addonDownloadUrl = environment.addonDownloadUrl;
  }
}
