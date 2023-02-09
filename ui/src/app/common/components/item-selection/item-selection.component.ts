import { Component, ElementRef, forwardRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import Fuse from 'fuse.js';
import { allItems } from '../../../all-items';
import { ItemData } from '../../item-data.interface';
import { SoftresRaidSlug } from '../../services/softres/softres-raid-slug';

@Component({
  selector: 'app-item-selection',
  templateUrl: './item-selection.component.html',
  styleUrls: ['./item-selection.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ItemSelectionComponent),
      multi: true
    }
  ]
})
export class ItemSelectionComponent implements ControlValueAccessor, OnInit, OnChanges {
  @ViewChild('selectedItemElement', { read: ElementRef })
  selectedItemRef!: ElementRef;
  @ViewChild('textFilterElement') textFilterRef!: ElementRef;
  @Input() instance: SoftresRaidSlug | undefined;
  public selectedItem: ItemData | undefined;
  public textFilterInput: string | undefined;
  public displayLimit: number = 25;
  public instanceItems: ItemData[] = [];
  public itemChoices: ItemData[] = [];

  private onChangeCallback = (_: any) => {};
  private onTouchedCallback = () => {};

  constructor() {}

  writeValue(value: ItemData): void {
    this.selectedItem = value;
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  ngOnInit(): void {
    this.setItemsToInstance(this.instance);
    this.applyFilters();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['instance'] && changes['instance'].currentValue !== changes['instance'].previousValue) {
      this.setItemsToInstance(this.instance);
      this.applyFilters();
    }
  }

  public onInputFocus() {
    console.log('on focus');
    if (this.selectedItemRef) {
      this.selectedItemRef.nativeElement.style.display = 'none';
    }
  }

  public onInputBlur() {
    console.log('on blur');
    if (this.selectedItemRef) {
      this.selectedItemRef.nativeElement.style.display = 'block';
    }
  }

  public onItemNameClick(item: ItemData): void {
    this.selectItem(item);
  }

  public onTextFilterKeyUp(): void {
    this.applyFilters();
  }

  private selectItem(item: ItemData): void {
    this.selectedItem = item;
    this.onChangeCallback(item);
  }

  private applyFilters(): void {
    this.itemChoices = this.fuzzySearch(this.textFilterInput);
  }

  private fuzzySearch(input: string | undefined): ItemData[] {
    input = input ?? '';
    const options: Fuse.IFuseOptions<ItemData> = {
      isCaseSensitive: false,
      shouldSort: true,
      distance: 100,
      keys: ['name']
    };

    const fuse: Fuse<ItemData> = new Fuse(this.instanceItems, options);
    const fuseResult: Fuse.FuseResult<ItemData>[] = fuse.search(input);
    return fuseResult.slice(0, 9).map((result) => result.item);
  }

  private setItemsToInstance(instance: string | undefined): void {
    this.instanceItems = Object.assign([], allItems);
    if (instance) {
      this.instanceItems = this.instanceItems.filter((item) => item.instance === this.instance);
    }
  }
}
