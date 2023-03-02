import { AfterViewInit, Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MathUtil } from '../../utils';
import { RaidAndSizeSelection } from './raid-and-size-selection';

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
  uniqueId = MathUtil.generateUUID();

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
