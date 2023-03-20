import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  // TODO: Potential alternative to use observables for changing localStorage values: https://www.npmjs.com/package/ngx-webstorage
  constructor() {}

  public store(group: string, key: string, value: any): void {
    localStorage.setItem(`${group}.${key}`, JSON.stringify(value));
  }

  public get(group: string, key: string): any {
    const stringValue: string | null = localStorage.getItem(`${group}.${key}`);
    if (!stringValue) {
      return undefined;
    }
    const value: any = JSON.parse(stringValue);
    return value;
  }
}
