import * as chokidar from 'chokidar';
import * as fs from 'fs';
const { format, parse } = require('lua-json');

export class ReadFile {
  constructor(private filePath: string) {}

  public watchFile(callback: (err: any, data: any) => void): chokidar.FSWatcher {
    return chokidar.watch(this.filePath).on('change', (event, path) => {
      console.log(`CHANGED: ${path}`);
      console.log(event, path);
      this.readFile(this.filePath, callback);
    });
  }

  public readFile(path: string | undefined, callback: (err: any, data: any) => void): void {
    if (!path) {
      callback('path undefined', null);
      return;
    }
    fs.readFile(path, 'utf-8', (err, data) => {
      if (err) {
        callback(err, null);
        return;
      }
      try {
        const out: any = parse(`return { ${data} }`);
        callback(null, out);
      } catch (err) {
        callback(err, null);
      }
    });
  }
}
