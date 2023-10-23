const { app, ipcMain, dialog } = require('electron');
const path = require('path');
const url = require('url');
import { BrowserWindow, IpcMainEvent } from 'electron';
import { ElectronAppActions } from './actions/electron-app-actions';
import { ElectronUiActions } from './actions/electron-ui-actions';
import { ReadFile } from './actions/read-file';

let win: BrowserWindow;
let readFile: ReadFile | undefined;

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

  ipcMain.on(ElectronUiActions.WATCH_FILE, (_event: IpcMainEvent, ...args: any) => {
    const filePath: string = args[0];
    console.log(`${ElectronUiActions.WATCH_FILE} event`);
    console.log(`now watching ${filePath}`);
    readFile = new ReadFile(filePath);
    readFile.watchFile((err: any, data: any) => {
      if (err) {
        alert('An error occurred reading the file :' + err.message);
        return;
      }
      win.webContents.send(ElectronAppActions.FILE_CHANGED, {
        filePath
      });
    });
  });

  ipcMain.on(ElectronUiActions.OPEN_FILE, async (_event: IpcMainEvent, ..._args: any) => {
    console.log(`${ElectronUiActions.OPEN_FILE} event`);
    const result = await dialog.showOpenDialog(win, {
      properties: ['openDirectory']
    });
    win.webContents.send(ElectronAppActions.FILE_OPENED, result);
  });
}
app.on('ready', createWindow);
// on macOS, closing the window doesn't quit the app
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
