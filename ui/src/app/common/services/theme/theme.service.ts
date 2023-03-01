import { Injectable } from '@angular/core';
import { Theme } from './theme.type';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public theme: Theme = 'dark';
  constructor() {}

  public getThemeClass(): { [key: string]: any } {
    const theme: { [key: string]: any } = this.theme === 'light' ? { 'light-theme': true } : { 'dark-theme': true };
    return theme;
  }

  public toggleTheme(): void {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
  }
}
