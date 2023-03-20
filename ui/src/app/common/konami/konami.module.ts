import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { KonamiDirective } from './konami.directive';
export * from './konami.directive';
@NgModule({
  imports: [CommonModule],
  declarations: [KonamiDirective],
  exports: [KonamiDirective]
})
export class KonamiModule {
  static forRoot(): ModuleWithProviders<KonamiModule> {
    return {
      ngModule: KonamiModule
    };
  }
}
