import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SpecializationData } from 'classic-companion-core';
import TimeAgo from 'javascript-time-ago';

// FIXME: Deprecate
export interface ParseColumnDeprecated {
  value?: number;
  specialization?: SpecializationData;
}
export interface ColumnFormat<T> {
  // FIXME: These are getting very specific
  type: 'number' | 'string' | 'last-updated' | 'parse' | 'class' | 'role' | 'date' | 'wcl-link' | 'custom';
  // FIXME: Use real types for formatParams
  formatParams?: any;
  customFormat?: (rowValue: T) => string;
  transform?: (rowValue: T) => any;
}
export type SortType = 'number' | 'string' | 'parse' | 'class' | 'role' | 'custom';
export type SortDirection = 'asc' | 'desc' | 'none';
export interface ColumnSpecification<T> {
  label: string | (() => string);
  valueKey: keyof T;
  format?: ColumnFormat<T>;
  transform?: (rowValue: T) => any;
  tooltip?: string | ((rowValue: T) => string | undefined);
  sortType?: SortType;
  customSort?: (a: T, b: T) => number;
  onClick?: (value: any) => void;
  style?: { [key: string]: any } | ((rowValue: T) => { [key: string]: any });
}

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit, OnChanges {
  @Input() data!: any[]; // FIXME: Should have a generic
  sortedData!: any[]; // FIXME: Should have a generic
  @Input() columns!: ColumnSpecification<any>[];
  @Input() sortArrowSide: 'left' | 'right' = 'right';
  sortedColumnId: number | undefined;
  sortDirection: SortDirection = 'none';
  private timeAgo: TimeAgo;

  constructor() {
    this.timeAgo = new TimeAgo('en-US');
  }

  ngOnInit(): void {
    this.sortedData = Object.assign([], this.data);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.sortedData = Object.assign([], this.data);
      if (this.sortedColumnId) {
        const sortColumn: ColumnSpecification<any> = this.columns[this.sortedColumnId];
        if (sortColumn.sortType) {
          this.sortedData = this.sortData(
            sortColumn.valueKey,
            sortColumn.sortType,
            this.sortDirection!,
            sortColumn.customSort
          );
        }
      }
    }
  }

  onClickColumnSort(columnId: number): void {
    this.sortColumn(columnId);
  }

  getLastUpdatedValue(lastUpdated: number | undefined): string {
    if (lastUpdated === undefined) {
      return '';
    }
    return this.timeAgo.format(lastUpdated, 'twitter-now');
  }

  // FIXME: Should have a generic? T instead of any?
  onClickLastUpdatedRefresh(dataRow: any, column: ColumnSpecification<any>): void {
    if (!column.onClick) {
      return;
    }
    dataRow.lastUpdatedChanging = true;
    column.onClick(dataRow);
  }

  // FIXME: Should have a generic? T instead of any?
  onClickCell(dataRow: any, column: ColumnSpecification<any>): void {
    if (!column.onClick || column.format?.type === 'last-updated') {
      return;
    }
    column.onClick(dataRow[column.valueKey]);
  }

  // FIXME: Should have a generic? T instead of any?
  getColumnLabel(column: ColumnSpecification<any>, columnIndex: number) {
    let label = '';
    if (this.sortArrowSide === 'left' && columnIndex == this.sortedColumnId) {
      label += this.getSortArrow();
    }

    if (typeof column.label === 'function') {
      label += column.label();
    } else {
      label += column.label;
    }

    if (this.sortArrowSide == 'right' && columnIndex == this.sortedColumnId) {
      label += this.getSortArrow();
    }
    return label;
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

  private getSortArrow(): string {
    if (this.sortDirection === 'asc') {
      return '🔼';
    }
    if (this.sortDirection === 'desc') {
      return '🔽';
    }
    return '';
  }

  private sortColumn(columnId: number): void {
    const column: ColumnSpecification<any> = this.columns[columnId]; // FIXME: Should have a generic
    if (!column.sortType) {
      return;
    }
    this.setSort(columnId);
    this.sortedData = this.sortData(column.valueKey, column.sortType, this.sortDirection!, column.customSort);
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
  private sortData(
    property: keyof any,
    sortType: SortType,
    direction: SortDirection,
    customSort?: (a: any, b: any) => number
  ): any[] {
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
      case 'class':
        return GridComponent.sortWowClass(this.sortedData, property, direction);
      case 'role':
        return GridComponent.sortString(this.sortedData, property, direction);
      case 'custom':
        if (!customSort) {
          throw new Error('custom sort column without custom sort function');
        }
        return GridComponent.sortCustom(this.sortedData, customSort, direction);
    }
  }
  static sortCustom(data: any[], customSort: (a: any, b: any) => number, direction: string): any[] {
    const sorted: any[] = data.sort(customSort);
    if (direction === 'asc') {
      return sorted;
    } else {
      return sorted.reverse();
    }
  }

  // FIXME: Should have a generic
  private static sortNumber(data: any[], property: keyof any, direction: 'asc' | 'desc'): any[] {
    const normalizeProperty = function (value: any) {
      if (!value) {
        value = 0;
      }
      return value;
    };
    if (direction === 'asc') {
      return data.sort((a, b) => normalizeProperty(a[property]) - normalizeProperty(b[property]));
    } else {
      return data.sort((a, b) => normalizeProperty(b[property]) - normalizeProperty(a[property]));
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

  // FIXME: Should have a generic
  private static sortWowClass(data: any[], property: keyof any, direction: 'asc' | 'desc'): any[] {
    if (direction === 'asc') {
      return data.sort((a, b) => (a[property].name > b[property].name ? -1 : 1));
    } else {
      return data.sort((a, b) => (b[property].name < a[property].name ? 1 : -1));
    }
  }
}
