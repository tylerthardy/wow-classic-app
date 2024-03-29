import { Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ]
})
export class DropdownComponent<T> implements ControlValueAccessor, OnInit {
  selectedItemRef!: ElementRef;
  @Input() blankLabel: string | undefined;
  @Input() removeBlank: boolean = false;
  @Input() options: T[] = [];
  @Input() labelPropertyName?: string;
  @Output() change: EventEmitter<T> = new EventEmitter<T>();
  public selection: T | undefined;
  public isDropdownShown: boolean = false;

  private onChangeCallback = (_: any) => {};
  private onTouchedCallback = () => {};

  constructor() {}

  writeValue(value: T): void {
    this.selection = value;
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  ngOnInit(): void {}

  public onDropdownItemClick(selectedValue: T | undefined) {
    this.selection = selectedValue;
    this.isDropdownShown = false;
    this.onChangeCallback(selectedValue);
    this.change.emit(selectedValue);
  }

  public onInputMouseEnter(): void {
    this.isDropdownShown = true;
  }

  public onInputMouseLeave(): void {
    this.isDropdownShown = false;
  }

  public onContentMouseEnter(): void {
    this.isDropdownShown = true;
  }

  public onContentMouseLeave(): void {
    this.isDropdownShown = false;
  }

  public getDropdownItemLabel(option?: T): string | undefined {
    if (!option) {
      return undefined;
    }
    // FIXME: Hacky
    const label: string = this.labelPropertyName ? (option as any)[this.labelPropertyName] : option;
    return label;
  }
}
