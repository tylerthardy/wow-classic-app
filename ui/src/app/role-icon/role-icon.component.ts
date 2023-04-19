import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RaidPlayerRole } from '../raid-lookup/raid-player-role.type';

@Component({
  selector: 'app-role-icon',
  templateUrl: './role-icon.component.html',
  styleUrls: ['./role-icon.component.scss']
})
export class RoleIconComponent implements OnChanges {
  @Input() public roleName?: RaidPlayerRole;
  @Input() public size: string = '16px';
  public imgSrc?: SafeUrl;

  constructor(private httpClient: HttpClient, private sanitizer: DomSanitizer) {
    this.imgSrc = this.getUrl();
  }

  public ngOnChanges(): void {
    if (!this.roleName) {
      this.imgSrc = undefined;
      return;
    }
    this.imgSrc = this.getUrl();
  }

  private getUrl(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(`assets/role-icons/${this.roleName}.png`);
  }
}
