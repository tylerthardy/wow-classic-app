import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ElectronService } from './electron.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, NgxJsonViewerModule],
  providers: [],
  bootstrap: [AppComponent, ElectronService]
})
export class AppModule {
  constructor(electronService: ElectronService) {
    electronService.initialize();
  }
}
