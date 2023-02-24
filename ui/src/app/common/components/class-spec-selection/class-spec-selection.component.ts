import { Component, ElementRef, forwardRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SpecializationData } from '../../specialization/specialization-data.interface';
import { specializations } from '../../specialization/specializations';
import { WowClass } from '../../specialization/wow-class';

@Component({
  selector: 'app-class-spec-selection',
  templateUrl: './class-spec-selection.component.html',
  styleUrls: ['./class-spec-selection.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ClassSpecSelectionComponent),
      multi: true
    }
  ]
})
export class ClassSpecSelectionComponent implements ControlValueAccessor, OnInit, OnChanges {
  @ViewChild('selectedItemElement', { read: ElementRef })
  selectedItemRef!: ElementRef;
  @ViewChild('textFilterElement') textFilterRef!: ElementRef;
  @ViewChild('dropdownContent', { static: false }) dropdownContentRef!: ElementRef;
  @Input() classId: number | undefined;
  @Input() blankLabel: string | undefined;
  @Input() removeBlank: boolean = false;
  public selectedSpec: SpecializationData | undefined;
  public specializations: SpecializationData[] = specializations;
  public isDropdownShown: boolean = false;
  public filteredSpecs: SpecializationData[] = [];

  private onChangeCallback = (_: any) => {};
  private onTouchedCallback = () => {};

  constructor() {}

  writeValue(value: SpecializationData): void {
    this.selectedSpec = value;
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  ngOnInit(): void {
    this.setSpecsToClass(this.classId);
    if (this.removeBlank && !this.selectedSpec) {
      this.selectedSpec = this.filteredSpecs[0];
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['classId'] && changes['classId'].currentValue !== changes['classId'].previousValue) {
      this.setSpecsToClass(this.classId);
    }
  }

  public onDropdownItemClick(spec: SpecializationData | undefined) {
    this.selectedSpec = spec;
    this.isDropdownShown = false;
    this.onChangeCallback(spec);
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

  // FIXME: This should be part of a data structure instead of having to loop through and map weird shit
  private setSpecsToClass(classId: number | undefined): void {
    this.filteredSpecs = Object.assign([], specializations);
    if (classId) {
      const wowClass: WowClass | undefined = WowClass.getClassByWarcraftLogsId(classId);
      if (!wowClass) {
        throw new Error('Cannot find wow class by wcl id ' + classId);
      }
      this.filteredSpecs = this.filteredSpecs.filter((spec) => spec.className === wowClass.name);
    }
  }
}
