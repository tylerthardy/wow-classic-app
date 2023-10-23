import { IpcRendererEvent } from 'electron';

const { contextBridge, ipcRenderer } = require('electron');

// These are actions available to the UI
contextBridge.exposeInMainWorld('api', {
  send: (channel: string, data: any) => {
    // whitelist channels
    // let validChannels = ['openModal'];
    // if (validChannels.includes(channel)) {
    ipcRenderer.send(channel, data);
    // }
  },
  receive: (channel: string, callback: any): void => {
    // let validChannels = ['fromMain'];
    // if (validChannels.includes(channel)) {
    // Deliberately strip event as it includes `sender`
    console.log(`registering ${channel}`, callback);
    ipcRenderer.on(channel, (event: IpcRendererEvent, ...args: any): void => {
      callback(channel, event, ...args);
    });
    // }
  }
});

console.log('preload complete');
