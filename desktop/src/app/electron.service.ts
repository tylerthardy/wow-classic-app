import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  private electron: any;

  constructor(private ngZone: NgZone) {}

  public initialize(): void {
    console.log('service initializing');
    this.electron = (window as any).api;

    this.electron.receive('actionZ', (action: any, params: any) => {
      console.log('here');
      this.ngZone.run(() => {
        console.log('ui receive', { action, params });
      });
    });
  }

  public send(action: any, params: any): any {
    this.electron.send(action, params);
  }
}
