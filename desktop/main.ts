const { app, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
import { BrowserWindow } from 'electron';
import { ReadFile } from './electron/actions/read-file';

let win: BrowserWindow;
const readFile = new ReadFile();

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // @ts-ignore TODO: Fix this
      enableRemoteModule: false,
      preload: path.join(__dirname, 'electron', 'preload.js')
    }
  });
  // load the dist folder from Angular
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, '/dist/index.html'),
      protocol: 'file:',
      slashes: true
    })
  );
  // The following is optional and will open the DevTools:
  // win.webContents.openDevTools()
  win.on('closed', () => {
    // @ts-ignore TODO: Fix this
    win = null;
  });

  ipcMain.on('watch-file', (event: any, args: any) => {
    console.log('watch-file event');
    readFile.watchFile((err: any, data: any) => {
      if (err) {
        alert('An error ocurred reading the file :' + err.message);
        return;
      }

      // Change how to handle the file content
      win.webContents.send('actionZ', data);
    });
  });

  ipcMain.on('open-file', (event: any, args: any) => {});
}
app.on('ready', createWindow);
// on macOS, closing the window doesn't quit the app
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
