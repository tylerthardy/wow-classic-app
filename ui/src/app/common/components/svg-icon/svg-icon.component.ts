import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-svg-icon',
  templateUrl: 'svg-icon.component.html',
  styleUrls: ['./svg-icon.component.scss']
})
export class SvgIconComponent implements OnChanges {
  @Input() public iconName?: string;
  @Input() public size: string = '16px';

  public svgIcon: any;

  constructor(private httpClient: HttpClient, private sanitizer: DomSanitizer) {}

  public ngOnChanges(): void {
    if (!this.iconName) {
      this.svgIcon = '';
      return;
    }
    this.httpClient.get(`assets/svg/${this.iconName}.svg`, { responseType: 'text' }).subscribe((value) => {
      this.svgIcon = this.sanitizer.bypassSecurityTrustHtml(value);
    });
  }
}
