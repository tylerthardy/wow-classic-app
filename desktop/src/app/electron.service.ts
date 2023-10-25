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
    if (!this.electron) {
      console.log('using spoofed electron');
      this.electron = this.getSpoofedElectron();
    }
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

  public send(channel: string, params: any): any {
    this.electron.send(channel, params);
  }

  private getSpoofedElectron(): any {
    return {
      send: (channel: string, params: any) => {
        console.log('spoofed send to electron: ' + channel, params);
      },
      receive: (
        channelToListen: any,
        callback: (channelReceived: any, event: IpcRendererEvent, ...args: any) => void
      ) => {
        console.log('spoofed receive register to electron: ' + channelToListen, callback);
      }
    };
  }
}
