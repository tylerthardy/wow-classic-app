import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Json2TreeModule } from 'ngx-json-tree';
import { SimpleModalModule } from 'ngx-simple-modal';
import { ToastContainerModule, ToastrModule } from 'ngx-toastr';
import { SafePipeModule } from 'safe-pipe';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { CardComponent } from './common/components/card/card.component';
import { ConfirmModalComponent } from './common/components/confirm-modal/confirm-modal.component';
import { GridComponent } from './common/components/grid/grid.component';
import { ItemSelectionComponent } from './common/components/item-selection/item-selection.component';
import { ParseNumberComponent } from './common/components/parse-number/parse-number.component';
import { RaidSizeSelectionComponent } from './common/components/raid-size-selection/raid-size-selection.component';
import { ServerSelectionComponent } from './common/components/server-selection/server-selection.component';
import { WowheadLinkComponent } from './common/components/wowhead-link/wowhead-link.component';
import { GlobalErrorHandler } from './common/global-error-handler';
import { CreateSoftresModalComponent } from './create-softres-modal/create-softres-modal.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlayerLookupComponent } from './player-lookup/player-lookup.component';
import { RaidInformationComponent } from './raid-information/raid-information.component';
import { RaidLeadHelperComponent } from './raid-lead-helper/raid-lead-helper.component';
import { RaidLookupComponent } from './raid-lookup/raid-lookup.component';
import { RaidSpamComponent } from './raid-spam/raid-spam.component';
import { SoftresManagerComponent } from './softres-manager/softres-manager.component';
import { SpecializationDataComponent } from './specialization-data/specialization-data.component';
import { SpecializationIconComponent } from './specialization-icon/specialization-icon.component';
import { VoaRaidBuilderComponent } from './voa-raid-builder/voa-raid-builder.component';

@NgModule({
  declarations: [
    AppComponent,
    WowheadLinkComponent,
    DashboardComponent,
    SpecializationDataComponent,
    SoftresManagerComponent,
    RaidLeadHelperComponent,
    CreateSoftresModalComponent,
    PlayerLookupComponent,
    SpecializationIconComponent,
    ConfirmModalComponent,
    RaidLookupComponent,
    CardComponent,
    ItemSelectionComponent,
    RaidSpamComponent,
    VoaRaidBuilderComponent,
    GridComponent,
    ParseNumberComponent,
    RaidInformationComponent,
    ServerSelectionComponent,
    RaidSizeSelectionComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    Json2TreeModule,
    SafePipeModule,
    SimpleModalModule,
    ToastrModule.forRoot({
      positionClass: 'inline',
      countDuplicates: true,
      resetTimeoutOnDuplicate: true,
      preventDuplicates: true
    }),
    ToastContainerModule
  ],
  providers: [
    {
      provide: AppConfig,
      useValue: new AppConfig()
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
