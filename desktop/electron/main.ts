import { BrowserWindow, app, ipcMain } from 'electron';
import { configureActions } from './actions';
const path = require('path');
const url = require('url');

let win: BrowserWindow;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // @ts-ignore TODO: Fix this
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  // load the dist folder from Angular
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, '../dist/index.html'),
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

  configureActions(win, ipcMain);
}
app.on('ready', createWindow);
// on macOS, closing the window doesn't quit the app
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
