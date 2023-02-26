import { Component, ElementRef, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { WowClass } from '../../specialization/wow-class';

@Component({
  selector: 'app-class-selection',
  templateUrl: './class-selection.component.html',
  styleUrls: ['./class-selection.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ClassSelectionComponent),
      multi: true
    }
  ]
})
export class ClassSelectionComponent implements ControlValueAccessor, OnInit {
  selectedItemRef!: ElementRef;
  @Input() blankLabel: string | undefined;
  @Input() removeBlank: boolean = false;
  public selectedClass: WowClass | undefined;
  public wowClasses: WowClass[] = WowClass.getAll();
  public isDropdownShown: boolean = false;

  private onChangeCallback = (_: any) => {};
  private onTouchedCallback = () => {};

  constructor() {}

  writeValue(value: WowClass): void {
    this.selectedClass = value;
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  ngOnInit(): void {}

  public onDropdownItemClick(wowClass: WowClass | undefined) {
    this.selectedClass = wowClass;
    this.isDropdownShown = false;
    this.onChangeCallback(wowClass);
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
}
