import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RaidData } from '../../services/raids/raid-data.interface';
import { raids } from '../../services/raids/raids';
import { SoftresRaidSlug } from '../../services/softres/softres-raid-slug';

@Component({
  selector: 'app-raid-selection',
  templateUrl: './raid-selection.component.html',
  styleUrls: ['./raid-selection.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RaidSelectionComponent),
      multi: true
    }
  ]
})
export class RaidSelectionComponent implements ControlValueAccessor, OnInit {
  selectedRaid!: string;
  @Input() removeDuplicates?: boolean;

  public raids: RaidData[] = raids;

  private onChangeCallback = (_: any) => {};
  private onTouchedCallback = () => {};

  constructor() {}

  writeValue(value: string): void {
    this.selectedRaid = value;
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  ngOnInit(): void {
    if (this.removeDuplicates) {
      const duplicateRaids: SoftresRaidSlug[] = [
        'eyeofeternity10p2',
        'eyeofeternity25',
        'obsidiansanctum10p2',
        'obsidiansanctum25'
      ];
      this.raids = this.raids.filter((raid) => !duplicateRaids.includes(raid.softresSlug));
    }
  }

  onSelectChange(event: Event) {
    const selectElement: HTMLSelectElement = event.target as HTMLSelectElement;
    this.selectedRaid = selectElement.value;
    this.onChangeCallback(this.selectedRaid);
  }
}
