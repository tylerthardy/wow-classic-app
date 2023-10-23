import * as chokidar from 'chokidar';
import * as fs from 'fs';
const { format, parse } = require('lua-json');

export class ReadFile {
  constructor(private filePath: string) {}

  public watchFile(callback: (err: any, data: any) => void): void {
    chokidar.watch(this.filePath).on('change', (event, path) => {
      console.log(`CHANGED: ${path}`);
      console.log(event, path);
      this.readFile(this.filePath, callback);
    });
  }

  private readFile(path: string, callback: (err: any, data: any) => void): void {
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
