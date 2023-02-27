import { Component, Input, OnInit } from '@angular/core';
import { RegionServerService } from '../../services/region-server.service';

@Component({
  selector: 'app-wcl-link-icon',
  templateUrl: './wcl-link-icon.component.html',
  styleUrls: ['./wcl-link-icon.component.scss']
})
export class WclLinkIconComponent implements OnInit {
  @Input() size: 'small' | 'large' = 'small';
  @Input() characterName!: string;
  public imageStyles: { [styleKey: string]: string } = {};

  constructor(private regionServerService: RegionServerService) {}

  ngOnInit(): void {
    this.imageStyles = this.getImageStyles();
  }

  public getUrl(): string {
    const region: string = this.regionServerService.regionServer.regionSlug!;
    const server: string = this.regionServerService.regionServer.serverSlug!;
    return `https://classic.warcraftlogs.com/character/${region}/${server}/${this.characterName}`;
  }

  private getImageStyles(): { [styleKey: string]: string } {
    const styles: { [styleKey: string]: string } = {};
    if (this.size === 'small') {
      styles['height'] = '16px';
    } else {
      styles['height'] = '24px';
    }
    return styles;
  }
}
