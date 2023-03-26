import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LocalStorageService } from '../common/services/local-storage.service';
import { CognitoConfig } from './cognito-config.interface';

@Injectable()
export class AppConfig {
  public apiUrl: string;
  public discordUrl: string;
  public advertisements: boolean;
  public get maintenance(): boolean {
    if (this.localStorageService.get('maintenance', 'bypass')) {
      return false;
    }
    return this._maintenance;
  }
  public set maintenance(value: boolean) {
    this._maintenance = value;
  }
  private _maintenance: boolean;
  public addonDownloadUrl: string;
  public cognito: CognitoConfig;

  constructor(private localStorageService: LocalStorageService) {
    this.apiUrl = environment.apiUrl;
    this.discordUrl = environment.discordUrl;
    this._maintenance = environment.maintenance;
    this.advertisements = environment.advertisements;
    this.addonDownloadUrl = environment.addonDownloadUrl;
    this.cognito = environment.cognito;
  }
}
