import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Region } from './region.interface';
import { regions } from './regions';

export interface RegionServer {
  regionSlug?: string;
  serverSlug?: string;
}

@Component({
  selector: 'app-server-selection',
  templateUrl: './server-selection.component.html',
  styleUrls: ['./server-selection.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ServerSelectionComponent),
      multi: true
    }
  ]
})
export class ServerSelectionComponent implements ControlValueAccessor, OnInit {
  regionSlug?: string;
  serverSlug?: string;
  regionServer: RegionServer = {};

  public regions: { [compactName: string]: Region } = regions;

  private onChangeCallback = (_: any) => {};
  private onTouchedCallback = () => {};

  constructor() {}

  writeValue(value: RegionServer): void {
    this.regionServer = value;
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  ngOnInit(): void {}

  onRegionSelectChange(event: Event) {
    const selectElement: HTMLSelectElement = event.target as HTMLSelectElement;
    this.regionSlug = selectElement.value;
    this.regionServer = {
      regionSlug: selectElement.value
    };
    this.onChangeCallback(this.regionServer);
  }

  onServerSelectChange(event: Event) {
    const selectElement: HTMLSelectElement = event.target as HTMLSelectElement;
    this.serverSlug = selectElement.value;
    this.regionServer = {
      regionSlug: this.regionServer.regionSlug,
      serverSlug: selectElement.value
    };
    this.onChangeCallback(this.regionServer);
  }
}
