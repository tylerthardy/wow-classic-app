import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { AddonWatcherComponent } from './addon-watcher/addon-watcher.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ElectronService } from './electron.service';
import { ProfileComponent } from './profile/profile.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

@NgModule({
  declarations: [AppComponent, SignUpComponent, SignInComponent, ProfileComponent, AddonWatcherComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, NgxJsonViewerModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent, ElectronService]
})
export class AppModule {
  constructor(electronService: ElectronService) {
    electronService.initialize();
  }
}
