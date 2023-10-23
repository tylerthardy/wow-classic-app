import { Component } from '@angular/core';
import { ElectronService } from './electron.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'wca-desktop';

  constructor(private electronService: ElectronService) {}

  public onLoadButtonClick(): void {
    this.electronService.send('action1', {
      a: 1,
      b: 7
    });
  }

  public watchFile(): void {
    this.electronService.send('watch-file', null);
  }
}
