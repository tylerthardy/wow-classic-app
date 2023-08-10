import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { AppModule } from './app/app.module';
import './app/common/extensions';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
} else {
  // Amplify debugging
  (window as any).LOG_LEVEL = 'DEBUG';
}

TimeAgo.addDefaultLocale(en);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
