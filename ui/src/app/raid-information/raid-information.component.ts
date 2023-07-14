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
    return this.raid.instanceSizeSelection.instance.getImage();
  }

  getInstanceName(): string {
    //FIXME: integrate into instance enum
    return this.raid.instanceSizeSelection.instance.name;
  }

  getInstanceSize(): number {
    //FIXME: Integrate into instance enum
    //FIXME: Only works for 10 & 25 sizes
    return this.raid.instanceSizeSelection.getSize();
  }
}
