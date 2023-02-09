import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
declare var $WowheadPower: any;

@Component({
  selector: 'wowhead-link',
  templateUrl: './wowhead-link.component.html',
  styleUrls: ['./wowhead-link.component.scss']
})
export class WowheadLinkComponent implements OnInit, OnChanges {
  @Input() type!: 'spell' | 'item';
  @Input() id!: number;
  @Input() disableLink: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.refreshStyle();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && changes['id'].currentValue !== changes['id'].previousValue) {
      this.refreshStyle();
    }
  }

  public get url() {
    if (this.disableLink) return '#';
    return `https://www.wowhead.com/wotlk/${this.type}=${this.id}`;
  }

  private refreshStyle(): void {
    setTimeout(() => $WowheadPower.refreshLinks(), 1);
  }
}
