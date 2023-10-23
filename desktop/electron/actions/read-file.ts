import * as chokidar from 'chokidar';
import * as fs from 'fs';
import * as path from 'path';

export class ReadFile {
  constructor() {}

  private fileName = 'NovaInstanceTracker.lua';
  private filePath = path.join(
    'C:/Program Files (x86)/World of Warcraft/_classic_/WTF/Account/MENTALSKATER45/SavedVariables',
    this.fileName
  );

  public watchFile(callback: (err: any, data: any) => void): void {
    chokidar.watch(this.filePath).on('change', (event, path) => {
      console.log(`CHANGED: ${path}`);
      console.log(event, path);
      this.readFile(this.filePath, callback);
    });
  }

  private readFile(path: string, callback: (err: any, data: any) => void): void {
    fs.readFile(path, 'utf-8', (err, data) => callback(err, data));
  }
}
