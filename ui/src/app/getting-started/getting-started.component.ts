import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../common/services/local-storage.service';
import { RegionServerService } from '../common/services/region-server.service';
import { AppConfig } from '../config/app.config';

@Component({
  selector: 'app-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss']
})
export class GettingStartedComponent implements OnInit {
  public maintenanceHide: boolean = false;

  constructor(
    public localStorageService: LocalStorageService,
    public regionServerService: RegionServerService,
    private appConfig: AppConfig
  ) {
    this.maintenanceHide = appConfig.maintenance;
  }

  ngOnInit(): void {}

  public onDownloadButtonClick(): void {
    window.open(this.appConfig.addonDownloadUrl, '_blank');
  }

  public onCloseButtonClick(): void {
    this.localStorageService.store('gettingStarted', 'hidden', true);
  }
}
