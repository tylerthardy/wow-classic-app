import { AfterViewInit, Component, ElementRef, Input, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Instance, Instances, RaidSize } from 'classic-companion-core';
import { MathUtil } from '../../utils';
import { IInstanceSizeSelection } from './instance-size-selection.interface';

@Component({
  selector: 'app-instance-size-selection',
  templateUrl: './instance-size-selection.component.html',
  styleUrls: ['./instance-size-selection.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InstanceSizeSelectionComponent),
      multi: true
    }
  ]
})
export class InstanceSizeSelectionComponent implements AfterViewInit, ControlValueAccessor {
  @ViewChild('raidSelect', { static: true }) raidSelectRef!: ElementRef<HTMLSelectElement>;
  @ViewChild('size10', { static: true }) size10Ref!: ElementRef<HTMLInputElement>;
  @ViewChild('size25', { static: true }) size25Ref!: ElementRef<HTMLInputElement>;

  @Input() public selectionType: 'checkbox' | 'radio' = 'checkbox';
  protected selectedInstance!: Instance;
  protected instances: Instance[] = Instances.All;
  protected uniqueId = MathUtil.generateUUID();

  // TODO: Dedupe instance with selectedInstance
  private value: IInstanceSizeSelection = { instance: Instances.ToGC, sizes: [10] };
  private onChangeCallback = (_: any) => {};
  private onTouchedCallback = () => {};

  constructor() {}

  // Lifecycles
  ngAfterViewInit(): void {
    this.setSizesUI();
  }

  // ControlValueAccessor
  writeValue(value: IInstanceSizeSelection): void {
    if (!value) {
      return; //throw new Error('no value set for InstanceSizeSelectionComponent');
    } else {
      console.log(value);
    }
    this.value = value;
    this.selectedInstance = value.instance;
    this.setSizesUI();
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  // TODO: any
  protected onSelectChange(event: any): void {
    // this.value.instance = event.target.value;
    // this.onChangeCallback(this.value);
  }

  // TODO: any
  protected onInputChange(event: any): void {
    if (!event.target) return;
    let element: HTMLInputElement = event.target as HTMLInputElement;

    let sizes: RaidSize[] = [...this.value.sizes];
    if (this.selectionType === 'radio') {
      if (element.id === 'size10' + this.uniqueId) {
        sizes = [10];
      }
      if (element.id === 'size25' + this.uniqueId) {
        sizes = [25];
      }
    } else {
      if (element.id === 'size10' + this.uniqueId) {
        if (element.checked) {
          sizes.push(10);
        } else {
          sizes = sizes.filter((s) => s !== 10);
        }
      }
      if (element.id === 'size25' + this.uniqueId) {
        if (element.checked) {
          sizes.push(25);
        } else {
          sizes = sizes.filter((s) => s !== 25);
        }
      }
    }

    this.value.sizes = sizes;
    this.onChangeCallback(this.value);
  }

  private setSizesUI(): void {
    this.size10Ref.nativeElement.checked = !!this.value.sizes.find((s) => s === 10) ?? false;
    this.size25Ref.nativeElement.checked = !!this.value.sizes.find((s) => s === 25) ?? false;
  }
}
