import { Component, Input, OnInit } from '@angular/core';
import { Raid } from '../common/services/raids/raid.interface';

export interface RaidInformationButton {
  label: string;
  click: () => void;
}

@Component({
  selector: 'app-raid-information',
  templateUrl: './raid-information.component.html',
  styleUrls: ['./raid-information.component.scss']
})
export class RaidInformationComponent implements OnInit {
  @Input() raid!: Raid;
  @Input() buttons: RaidInformationButton[] = [];

  constructor() {}

  ngOnInit(): void {
    if (!this.raid) {
      throw new Error('raid is required for this component');
    }
  }

  getInstanceImageUrl(): string {
    //FIXME: integrate into instance enum
    let id: number;
    switch (this.raid.raidAndSize.getSoftResSlug()) {
      case 'naxxdragons10p2':
      case 'naxxdragons25':
      case 'wotlknaxx10p2':
      case 'wotlknaxx25':
      case 'obsidiansanctum10p2':
      case 'obsidiansanctum25':
      case 'eyeofeternity10p2':
      case 'eyeofeternity25':
      case 'wyrmrest10p2':
      case 'wyrmrest25':
        id = 1015;
        break;
      case 'ulduar10':
      case 'ulduar25':
        id = 1017;
        break;
      default:
        id = 1000;
    }
    return `https://assets.rpglogs.com/img/warcraft/zones/zone-${id}-header-background.jpg`;
  }

  getInstanceName(): string {
    //FIXME: integrate into instance enum
    switch (this.raid.raidAndSize.getSoftResSlug()) {
      case 'naxxdragons10p2':
      case 'naxxdragons25':
        return 'Naxx / Sarth / Maly';
      case 'wotlknaxx10p2':
      case 'wotlknaxx25':
        return 'Naxxramas';
      case 'obsidiansanctum10p2':
      case 'obsidiansanctum25':
        return 'Obsidian Sanctum';
      case 'eyeofeternity10p2':
      case 'eyeofeternity25':
        return 'Eye of Eternity';
      case 'wyrmrest10p2':
      case 'wyrmrest25':
        return 'Wyrmrest';
      case 'ulduar10':
      case 'ulduar25':
        return 'Ulduar';
      default:
        return 'Unknown';
    }
  }

  getInstanceSize(): number {
    //FIXME: Integrate into instance enum
    //FIXME: Only works for 10 & 25 sizes
    return this.raid.raidAndSize.getSize();
  }
}
