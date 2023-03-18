import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
  @Input() hideLabel: boolean = false;
  @ViewChild('anchorTag') anchorElement!: ElementRef<HTMLAnchorElement>;

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
    if (this.disableLink) return null;
    return `https://www.wowhead.com/wotlk/${this.type}=${this.id}`;
  }

  onClickUrl(event: Event) {
    if (this.disableLink) {
      event.preventDefault();
    }
  }

  public getItemAnchorClasses(): { [cssStyle: string]: boolean } {
    return {
      'hide-label': this.hideLabel
    };
  }

  private refreshStyle(): void {
    if (this.anchorElement) {
      // Reset class list because old item quality classes will linger
      this.anchorElement.nativeElement.className = '';
      // Reset the inner HTML because WowheadPower replaces them with the item name
      this.anchorElement.nativeElement.innerHTML = '<div class="loading-spinner"></div>';
      // Remove background attribute because background image will linger
      this.anchorElement.nativeElement.style.removeProperty('background-image');
    }

    // refreshLinks is performed on the window, so all links are refreshed.
    // We reset the refreshHandle so only the last gets ran, because Angular change detection is faster than a 1ms timeout.
    clearTimeout(WowheadLinkComponent.refreshHandle);
    WowheadLinkComponent.refreshHandle = setTimeout(() => {
      $WowheadPower.refreshLinks();
    }, 1);
  }

  private static refreshHandle: NodeJS.Timeout;
}
