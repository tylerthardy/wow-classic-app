import { Injectable } from '@angular/core';
import { RegionServer } from '../components/server-selection/region-server.interface';
import { LocalStorageService } from './local-storage.service';
import { ToastService } from './toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class RegionServerService {
  public get regionServer(): RegionServer {
    return this._regionServer;
  }
  public set regionServer(value: RegionServer) {
    this._regionServer = value;
    this.localStorageService.store('regionServer', 'regionServer', value);
  }

  private _regionServer: RegionServer = {};
  constructor(private localStorageService: LocalStorageService, private toastService: ToastService) {
    const regionServer: RegionServer = this.localStorageService.get('regionServer', 'regionServer');
    if (regionServer) {
      this.regionServer = regionServer;
    }
  }

  public validate(showWarning: boolean = true): boolean {
    if (!this.regionServer.regionSlug || !this.regionServer.serverSlug) {
      if (showWarning) {
        this.toastService.warn('Invalid Server', 'Choose your server at top of page');
      }
      return false;
    }
    return true;
  }
}
