import { ChangeDetectorRef, Component } from '@angular/core';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import { ElectronAppActions } from '../../../electron/actions/electron-app-actions';
import { ElectronUiActions } from '../../../electron/actions/electron-ui-actions';
import { ElectronService } from '../electron.service';

@Component({
  selector: 'app-addon-watcher',
  templateUrl: './addon-watcher.component.html',
  styleUrls: ['./addon-watcher.component.scss']
})
export class AddonWatcherComponent {
  public lastUpdated?: number;
  public data: any;
  public isLoading: boolean = false;
  public filePath: string =
    'C:/Program Files (x86)/World of Warcraft/_classic_/WTF/Account/MENTALSKATER45/SavedVariables/NovaInstanceTracker.lua';
  private timeAgo: TimeAgo;

  constructor(private electronService: ElectronService, cdRef: ChangeDetectorRef) {
    TimeAgo.addDefaultLocale(en);
    this.timeAgo = new TimeAgo('en-US');
    // TODO: Use a backoff here since after 60 seconds we only show minutes
    setInterval(() => {
      cdRef.detectChanges();
    }, 5000);

    this.electronService.receive(ElectronAppActions.FILE_OPENED, (_channel: any, _params: any, ...args: any) => {
      this.filePath = args[0].filePaths[0];
      this.watchFile();
    });

    this.electronService.receive(ElectronAppActions.FILE_CHANGED, (_channel: any, _params: any, ...args: any) => {
      this.isLoading = false;
      const data: string = args[0];
      this.data = data;
      this.lastUpdated = Date.now();
    });

    // ASSUMPTION: electron is ready
    this.watchFile();
  }

  private watchFile(): void {
    this.electronService.send(ElectronUiActions.WATCH_FILE, this.filePath);
    this.readFile();
  }

  private readFile(): void {
    this.electronService.send(ElectronUiActions.READ_FILE, this.filePath);
    this.isLoading = true;
  }

  private openFile(): void {
    this.electronService.send(ElectronUiActions.OPEN_FILE, null);
  }

  protected onOpenFileClick(): void {
    this.openFile();
  }

  protected onWatchFileClick(): void {
    this.watchFile();
  }

  protected getLastUpdatedValue(lastUpdated: number | undefined): string {
    if (lastUpdated === undefined) {
      return 'Never';
    }
    return this.timeAgo.format(lastUpdated, 'twitter-now');
  }
}
