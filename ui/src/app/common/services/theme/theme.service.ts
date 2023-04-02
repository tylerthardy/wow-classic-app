import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LocalStorageService } from '../local-storage.service';
import { Theme } from './theme.type';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public themeChanged$: Observable<Theme>;
  private _theme: Theme = 'dark';
  public get theme(): Theme {
    return this._theme;
  }
  private themeChangeSubject: Subject<Theme> = new Subject<Theme>();

  constructor(private localStorageService: LocalStorageService) {
    this.themeChanged$ = this.themeChangeSubject.asObservable();
    const theme: Theme = this.localStorageService.get('theme', 'userTheme');
    if (theme) {
      this.setTheme(theme);
    }
    this.setHtmlTheme();
  }

  public getThemeClass(): { [key: string]: any } {
    const theme: { [key: string]: any } = this.theme === 'light' ? { 'light-theme': true } : { 'dark-theme': true };
    return theme;
  }

  public setTheme(theme: Theme): void {
    this._theme = theme;
    this.themeChangeSubject.next(theme);
  }

  public toggleTheme(): void {
    const newTheme: Theme = this.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    this.setHtmlTheme();
    this.storeTheme();
  }

  public setHtmlTheme(): void {
    // remove scrollbars
    document.documentElement.style.overflow = 'hidden';
    // trigger reflow so that overflow style is applied
    document.body.clientWidth;
    // change scheme
    document.documentElement.setAttribute('data-color-scheme', this.getThemeLightOrDarkString());
    // remove overflow style, which will bring back the scrollbar with the correct scheme
    document.documentElement.style.overflow = '';
  }

  private getThemeLightOrDarkString(): string {
    return this.theme === 'light' ? 'light' : 'dark';
  }

  private storeTheme(): void {
    this.localStorageService.store('theme', 'userTheme', this.theme);
  }
}
