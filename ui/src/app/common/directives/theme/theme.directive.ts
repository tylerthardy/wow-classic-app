import { Directive, ElementRef } from '@angular/core';
import { ThemeService } from '../../services/theme/theme.service';
import { Theme } from '../../services/theme/theme.type';

@Directive({
  selector: '[appTheme]'
})
export class ThemeDirective {
  constructor(private el: ElementRef, themeService: ThemeService) {
    // Apply current theme
    this.setThemeClassOnElement(themeService.theme);

    // And subscribe to any changes in theme
    themeService.themeChanged$.subscribe((theme: Theme) => {
      this.setThemeClassOnElement(theme);
    });
  }

  private setThemeClassOnElement(theme: Theme): void {
    if (theme === 'light') {
      this.el.nativeElement.classList.add('light-theme');
      this.el.nativeElement.classList.remove('dark-theme');
    } else {
      this.el.nativeElement.classList.add('dark-theme');
      this.el.nativeElement.classList.remove('light-theme');
    }
  }
}
