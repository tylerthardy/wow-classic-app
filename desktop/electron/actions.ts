import { FSWatcher } from 'chokidar';
import { BrowserWindow, IpcMain, IpcMainEvent, dialog } from 'electron';
import { ElectronAppActions } from './actions/electron-app-actions';
import { ElectronUiActions } from './actions/electron-ui-actions';
import { ReadFile } from './actions/read-file';

let readFile: ReadFile | undefined;
let watcher: FSWatcher | null;

export function configureActions(win: BrowserWindow, ipcMain: IpcMain) {
  ipcMain.on(ElectronUiActions.WATCH_FILE, (_event: IpcMainEvent, ...args: any) => {
    if (watcher) {
      watcher.removeAllListeners();
      watcher = null;
    }
    const filePath: string = args[0];
    console.log(`${ElectronUiActions.WATCH_FILE} event`);
    console.log(`now watching ${filePath}`);
    readFile = new ReadFile(filePath);
    watcher = readFile.watchFile((err: any, data: any) => {
      if (err) {
        alert('An error occurred reading the file :' + err.message);
        return;
      }
      win.webContents.send(ElectronAppActions.FILE_CHANGED, {
        data
      });
    });
  });

  ipcMain.on(ElectronUiActions.READ_FILE, async (_event: IpcMainEvent, ...args: any) => {
    console.log(`${ElectronUiActions.READ_FILE} event`);
    const filePath: string = args[0];
    console.log(`reading ${filePath}`);
    if (!readFile) {
      console.error('no file watched');
      return;
    }
    readFile.readFile(filePath, (err: any, data: any) => {
      if (err) {
        alert('An error occurred reading the file :' + err.message);
        return;
      }
      win.webContents.send(ElectronAppActions.FILE_CHANGED, {
        data
      });
    });
  });

  ipcMain.on(ElectronUiActions.OPEN_FILE, async (_event: IpcMainEvent, ..._args: any) => {
    console.log(`${ElectronUiActions.OPEN_FILE} event`);
    const result = await dialog.showOpenDialog(win, {
      // properties: ['openDirectory']
    });
    win.webContents.send(ElectronAppActions.FILE_OPENED, result);
  });
}
