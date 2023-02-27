import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SpecializationData } from '../../specialization/specialization-data.interface';

// FIXME: Deprecate
export interface ParseColumnDeprecated {
  value?: number;
  specialization?: SpecializationData;
}
export interface ColumnFormat<T> {
  type: 'number' | 'string' | 'parse' | 'date' | 'wcl-link' | 'custom';
  formatParams?: any;
  customFormat?: (rowValue: T) => string;
  transform?: (rowValue: T) => any;
}
export type SortType = 'number' | 'string' | 'parse';
export type SortDirection = 'asc' | 'desc' | 'none';
export interface ColumnSpecification<T> {
  label: string;
  valueKey: keyof T;
  format?: ColumnFormat<T>;
  transform?: (rowValue: T) => any;
  tooltip?: string | ((rowValue: T) => string | undefined);
  sortType?: SortType;
  onClick?: (value: any) => void;
  style?: { [key: string]: any } | ((rowValue: T) => { [key: string]: any });
}

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, OnChanges {
  @Input() data!: any[]; // FIXME: Should have a generic
  sortedData!: any[]; // FIXME: Should have a generic
  @Input() columns!: ColumnSpecification<any>[];
  sortedColumnId: number | undefined;
  sortDirection: SortDirection = 'none';

  constructor() {}

  ngOnInit(): void {
    this.sortedData = Object.assign([], this.data);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.sortedData = Object.assign([], this.data);
      if (this.sortedColumnId) {
        const sortColumn: ColumnSpecification<any> = this.columns[this.sortedColumnId];
        if (sortColumn.sortType) {
          this.sortedData = this.sortData(sortColumn.valueKey, sortColumn.sortType, this.sortDirection!);
        }
      }
    }
  }

  onClickColumnSort(columnId: number): void {
    this.sortColumn(columnId);
  }

  // FIXME: Should have a generic
  onClickCell(dataRow: any, column: ColumnSpecification<any>): void {
    if (!column.onClick) {
      return;
    }
    column.onClick(dataRow[column.valueKey]);
  }

  // TODO: Signature "dataRow: any, column: ColumnSpecification<any>" is repeated - indicates a class, method, or pattern
  getCellValue(dataRow: any, column: ColumnSpecification<any>): any {
    if (column.transform) {
      return column.transform(dataRow);
    }
    return dataRow[column.valueKey];
  }

  getCellStyle(dataRow: any, column: ColumnSpecification<any>): { [key: string]: any } {
    if (!column.style) {
      return {};
    }
    if (typeof column.style === 'function') {
      return column.style(dataRow);
    }
    return column.style;
  }

  getCellTooltip(dataRow: any, column: ColumnSpecification<any>): string | undefined {
    if (!column.tooltip) {
      return undefined;
    }
    if (typeof column.tooltip === 'function') {
      return column.tooltip(dataRow);
    }
    return column.tooltip;
  }

  getColumnCustomFormat(column: ColumnSpecification<any>, dataRow: any) {
    if (!column.format?.customFormat) {
      throw new Error('no custom format for custom column ' + column.valueKey.toString());
    }
    return column.format.customFormat(dataRow);
  }

  private sortColumn(columnId: number): void {
    const column: ColumnSpecification<any> = this.columns[columnId]; // FIXME: Should have a generic
    if (!column.sortType) {
      return;
    }
    this.setSort(columnId);
    this.sortedData = this.sortData(column.valueKey, column.sortType, this.sortDirection!);
  }

  private setSort(columnId: number) {
    const FIRST_SORT_DIRECTION: SortDirection = 'desc';
    const SECOND_SORT_DIRECTION: SortDirection = 'asc';

    if (columnId === this.sortedColumnId) {
      if (this.sortDirection === FIRST_SORT_DIRECTION) {
        this.sortDirection = SECOND_SORT_DIRECTION;
      } else if (this.sortDirection === SECOND_SORT_DIRECTION) {
        this.sortDirection = 'none';
      } else {
        this.sortDirection = FIRST_SORT_DIRECTION;
      }
    } else {
      this.sortDirection = FIRST_SORT_DIRECTION;
    }
    this.sortedColumnId = columnId;
  }

  // FIXME: Should have a generic
  private sortData(property: keyof any, sortType: SortType, direction: SortDirection): any[] {
    if (direction === 'none') {
      return Object.assign([], this.data);
    }
    switch (sortType) {
      case 'number':
        return GridComponent.sortNumber(this.sortedData, property, direction);
      case 'string':
        return GridComponent.sortString(this.sortedData, property, direction);
      case 'parse':
        return GridComponent.sortParse(this.sortedData, property, direction);
    }
  }

  // FIXME: Should have a generic
  private static sortNumber(data: any[], property: keyof any, direction: 'asc' | 'desc'): any[] {
    if (direction === 'asc') {
      return data.sort((a, b) => a[property] - b[property]);
    } else {
      return data.sort((a, b) => b[property] - a[property]);
    }
  }

  // FIXME: Should have a generic
  private static sortString(data: any[], property: keyof any, direction: 'asc' | 'desc'): any[] {
    if (direction === 'asc') {
      return data.sort((a, b) => (a[property] > b[property] ? -1 : 1));
    } else {
      return data.sort((a, b) => (b[property] < a[property] ? 1 : -1));
    }
  }

  // FIXME: Should have a generic
  private static sortParse(data: any[], property: keyof any, direction: 'asc' | 'desc'): any[] {
    if (direction === 'asc') {
      return data.sort((a, b) => a[property].value - b[property].value);
    } else {
      return data.sort((a, b) => b[property].value - a[property].value);
    }
  }
}
