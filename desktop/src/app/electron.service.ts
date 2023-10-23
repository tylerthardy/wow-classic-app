import { Injectable, NgZone } from '@angular/core';
import { IpcRendererEvent } from 'electron';

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

  // TODO: Use a Subject
  public receive(
    channelToListen: any,
    callback: (channelReceived: any, event: IpcRendererEvent, ...args: any) => void
  ): void {
    // Wrap callback in ngZone so that it may receive change detection
    const wrappedCallback = (channelReceived: any, event: IpcRendererEvent, ...args: any) => {
      this.ngZone.run(() => callback(channelReceived, event, ...args));
    };
    this.electron.receive(channelToListen, wrappedCallback);
  }

  public send(action: any, params: any): any {
    this.electron.send(action, params);
  }
}
