import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

export interface IRaidSizeSelection {
  raid: string;
  size: number;
}

@Component({
  selector: 'app-raid-size-selection',
  templateUrl: './raid-size-selection.component.html',
  styleUrls: ['./raid-size-selection.component.scss']
  // providers: [
  //   {
  //     provide: NG_VALUE_ACCESSOR,
  //     useExisting: forwardRef(() => RaidSizeSelectionComponent),
  //     multi: true
  //   }
  // ]
})
export class RaidSizeSelectionComponent implements OnInit, AfterViewInit {
  @ViewChild('raidSelect', { static: true }) raidSelectRef!: ElementRef<HTMLInputElement>;
  @ViewChild('size10', { static: true }) size10Ref!: ElementRef<HTMLInputElement>;
  @ViewChild('size25', { static: true }) size25Ref!: ElementRef<HTMLInputElement>;

  @Input() raid: string | undefined = '';
  @Input() size10: boolean = false;
  @Input() size25: boolean = false;
  @Input() values: IRaidSizeSelection[] = [];
  selectionType: 'checkbox' | 'radio' = 'checkbox';

  constructor() {}

  ngOnInit(): void {
    this.setValues();
  }

  ngAfterViewInit(): void {
    this.setUI();
  }

  onSelectChange(event: any): void {
    this.raid = event.target.value;
    this.setValues();
  }

  onInputChange(event: any): void {
    if (!event.target) return;

    let element: HTMLInputElement = event.target as HTMLInputElement;
    if (this.selectionType === 'radio') {
      if (element.id === 'size10') {
        this.size10 = true;
        this.size25 = false;
      }
      if (element.id === 'size25') {
        this.size10 = false;
        this.size25 = true;
      }
    } else {
      if (element.id === 'size10') {
        this.size10 = element.checked;
      }
      if (element.id === 'size25') {
        this.size25 = element.checked;
      }
    }
    this.setValues();
  }

  private setUI(): void {
    this.raidSelectRef.nativeElement.value = this.raid ?? '';
    this.size10Ref.nativeElement.checked = this.size10;
    this.size25Ref.nativeElement.checked = this.size25;
  }

  private setValues(): void {
    const values = this.constructValues();
    this.values = values;
    // this.onChangeCallback(values);
  }

  private constructValues(): IRaidSizeSelection[] {
    const values: IRaidSizeSelection[] = [];
    if (!this.raid) {
      return [];
    }
    if (this.size10) {
      values.push({
        raid: this.raid,
        size: 10
      });
    }
    if (this.size25) {
      values.push({
        raid: this.raid,
        size: 25
      });
    }
    return values;
  }

  // writeValue(value: string): void {
  //   this.selectedRaid = value;
  // }
  // registerOnChange(fn: any): void {
  //   this.onChangeCallback = fn;
  // }
  // registerOnTouched(fn: any): void {
  //   this.onTouchedCallback = fn;
  // }

  // ngOnInit(): void {
  //   if (this.removeDuplicates) {
  //     const duplicateRaids: SoftresRaidSlug[] = [
  //       'eyeofeternity10p2',
  //       'eyeofeternity25',
  //       'obsidiansanctum10p2',
  //       'obsidiansanctum25'
  //     ];
  //     this.raids = this.raids.filter((raid) => !duplicateRaids.includes(raid.softresSlug));
  //   }
  // }

  // onSelectChange(event: Event) {
  //   const selectElement: HTMLSelectElement = event.target as HTMLSelectElement;
  //   this.selectedRaid = selectElement.value;
  //   this.onChangeCallback(this.selectedRaid);
  // }
}
