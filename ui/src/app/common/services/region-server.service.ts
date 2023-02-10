import { Injectable } from '@angular/core';
import { RegionServer } from '../components/server-selection/region-server.interface';
import { LocalStorageService } from './local-storage.service';

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
  constructor(private localStorageService: LocalStorageService) {
    const regionServer: RegionServer = this.localStorageService.get('regionServer', 'regionServer');
    if (regionServer) {
      this.regionServer = regionServer;
    }
  }
}
