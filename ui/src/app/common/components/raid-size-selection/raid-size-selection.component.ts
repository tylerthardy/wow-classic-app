import { AfterViewInit, Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SoftresRaidSlug } from '../../services/softres/softres-raid-slug';

export interface IRaidAndSizeSelection {
  raid?: string;
  size10?: boolean;
  size25?: boolean;
}

export class RaidAndSizeSelection implements IRaidAndSizeSelection {
  public raid?: string;
  public size10?: boolean;
  public size25?: boolean;

  constructor(value: IRaidAndSizeSelection = {}) {
    this.raid = value.raid;
    this.size10 = value.size10;
    this.size25 = value.size25;
  }
  public hasRaidAndSize(): boolean {
    return !!this.raid && (this.size10 === true || this.size25 === true);
  }

  public getSoftResSlug(): SoftresRaidSlug | undefined {
    const slugs: SoftresRaidSlug[] = this.getSoftResSlugs();
    if (slugs.length === 0) {
      return undefined;
    }
    if (slugs.length > 1) {
      throw new Error("Can't get slug: More than 1 size selected");
    }
    return slugs[0];
  }

  public getSize(): number {
    if (!this.size10 && !this.size25) {
      throw new Error("Can't get size: No size selected");
    }
    if (this.size10 && this.size25) {
      throw new Error("Can't get size: More than 1 size selected");
    }
    return this.size10 ? 10 : 25;
  }

  public getSoftResSlugs(): SoftresRaidSlug[] {
    const results: SoftresRaidSlug[] = [];
    if (!this.hasRaidAndSize()) {
      return results;
    }
    if (this.raid === 'ulduar') {
      if (this.size10) {
        results.push('ulduar10');
      }
      if (this.size25) {
        results.push('ulduar25');
      }
    }
    if (this.raid === 'wotlknaxx') {
      if (this.size10) {
        results.push('wotlknaxx10p2');
      }
      if (this.size25) {
        results.push('wotlknaxx25');
      }
    }
    if (this.raid === 'obsidiansanctum') {
      if (this.size10) {
        results.push('obsidiansanctum10p2');
      }
      if (this.size25) {
        results.push('obsidiansanctum25');
      }
    }
    if (this.raid === 'eyeofeternity') {
      if (this.size10) {
        results.push('eyeofeternity10p2');
        if (this.size25) {
          results.push('eyeofeternity25');
        }
      }
    }
    return results;
  }

  public duplicate(): RaidAndSizeSelection {
    return new RaidAndSizeSelection({
      raid: this.raid,
      size10: this.size10,
      size25: this.size25
    });
  }
}

function generateUUID() {
  // Public Domain/MIT
  var d = new Date().getTime(); //Timestamp
  var d2 = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

@Component({
  selector: 'app-raid-size-selection',
  templateUrl: './raid-size-selection.component.html',
  styleUrls: ['./raid-size-selection.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RaidSizeSelectionComponent),
      multi: true
    }
  ]
})
export class RaidSizeSelectionComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  @ViewChild('raidSelect', { static: true }) raidSelectRef!: ElementRef<HTMLInputElement>;
  @ViewChild('size10', { static: true }) size10Ref!: ElementRef<HTMLInputElement>;
  @ViewChild('size25', { static: true }) size25Ref!: ElementRef<HTMLInputElement>;
  @Input() selectionType: 'checkbox' | 'radio' = 'checkbox';
  uniqueId = generateUUID();

  value: RaidAndSizeSelection = new RaidAndSizeSelection();

  private onChangeCallback = (_: any) => {};
  private onTouchedCallback = () => {};

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.setUI();
  }

  writeValue(value: RaidAndSizeSelection): void {
    this.value = value;
    this.setUI();
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  onSelectChange(event: any): void {
    this.value.raid = event.target.value;
    this.onChangeCallback(this.value);
  }

  onInputChange(event: any): void {
    if (!event.target) return;

    let element: HTMLInputElement = event.target as HTMLInputElement;
    if (this.selectionType === 'radio') {
      if (element.id === 'size10' + this.uniqueId) {
        this.value.size10 = true;
        this.value.size25 = false;
      }
      if (element.id === 'size25' + this.uniqueId) {
        this.value.size10 = false;
        this.value.size25 = true;
      }
    } else {
      if (element.id === 'size10' + this.uniqueId) {
        this.value.size10 = element.checked;
      }
      if (element.id === 'size25' + this.uniqueId) {
        this.value.size25 = element.checked;
      }
    }
    this.onChangeCallback(this.value);
  }

  private setUI(): void {
    if (!this.value) {
      return;
    }
    this.raidSelectRef.nativeElement.value = this.value.raid ?? '';
    this.size10Ref.nativeElement.checked = this.value.size10 ?? false;
    this.size25Ref.nativeElement.checked = this.value.size25 ?? false;
  }
}
