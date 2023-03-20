import { Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';
import { Theme } from './theme.type';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public theme: Theme = 'dark';
  constructor(private localStorageService: LocalStorageService) {
    const theme: Theme = this.localStorageService.get('theme', 'userTheme');
    if (theme) {
      this.theme = theme;
    }
    this.setHtmlTheme();
  }

  public getThemeClass(): { [key: string]: any } {
    const theme: { [key: string]: any } = this.theme === 'light' ? { 'light-theme': true } : { 'dark-theme': true };
    return theme;
  }

  public toggleTheme(): void {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.setHtmlTheme();
    this.storeTheme();
  }

  public setHtmlTheme(): void {
    // remove scrollbars
    document.documentElement.style.overflow = 'hidden';
    // trigger reflow so that overflow style is applied
    document.body.clientWidth;
    // change scheme
    document.documentElement.setAttribute('data-color-scheme', this.theme === 'light' ? 'light' : 'dark');
    // remove overflow style, which will bring back the scrollbar with the correct scheme
    document.documentElement.style.overflow = '';
  }

  private storeTheme(): void {
    this.localStorageService.store('theme', 'userTheme', this.theme);
  }
}
