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
  }

  public getThemeClass(): { [key: string]: any } {
    const theme: { [key: string]: any } = this.theme === 'light' ? { 'light-theme': true } : { 'dark-theme': true };
    return theme;
  }

  public toggleTheme(): void {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.storeTheme();
  }

  private storeTheme(): void {
    this.localStorageService.store('theme', 'userTheme', this.theme);
  }
}
