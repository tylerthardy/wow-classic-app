// import { ElectronAppActions } from './actions/electron-app-actions';

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
  receive: (channel: string, func: any) => {
    // let validChannels = ['fromMain'];
    // if (validChannels.includes(channel)) {
    // Deliberately strip event as it includes `sender`
    console.log(`registering ${channel}`, func);
    ipcRenderer.on(channel, (event: any, ...args: any) => func(...args));
    ipcRenderer.send(channel, {});
    // }
  }
});

// // These are electron handlers for UI actions
// ipcRenderer.on('read file', (a: any, b: any): any => {
//   console.log(a, b);
// });
// ipcRenderer.send('read file', { test: 1 });

// ipcRenderer.on('action1', (a: any, b: any): any => {
//   console.log(a, b);
// });

console.log('preload complete');
