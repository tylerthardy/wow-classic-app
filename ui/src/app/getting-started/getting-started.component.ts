import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../common/services/local-storage.service';
import { RegionServerService } from '../common/services/region-server.service';

@Component({
  selector: 'app-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss']
})
export class GettingStartedComponent implements OnInit {
  constructor(public localStorageService: LocalStorageService, public regionServerService: RegionServerService) {}

  ngOnInit(): void {}

  public onDownloadButtonClick(): void {
    window.open('https://wowclassicapp-addon.s3.amazonaws.com/GroupMembersExporter.zip', '_blank');
  }

  public onCloseButtonClick(): void {
    this.localStorageService.store('gettingStarted', 'hidden', true);
  }
}