import { NgModule } from '@angular/core';
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
import { RaidSelectionComponent } from './common/components/raid-selection/raid-selection.component';
import { ServerSelectionComponent } from './common/components/server-selection/server-selection.component';
import { GraphQLModule } from './common/services/graphql/graphql.module';
import { CreateSoftresModalComponent } from './create-softres-modal/create-softres-modal.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GuildLogComponent } from './guild-log/guild-log.component';
import { GuildLogsSummaryComponent } from './guild-logs-summary/guild-logs-summary.component';
import { PlayerLookupComponent } from './player-lookup/player-lookup.component';
import { PlayerRankingsComponent } from './player-rankings/player-rankings.component';
import { RaidInformationComponent } from './raid-information/raid-information.component';
import { RaidLeadHelperComponent } from './raid-lead-helper/raid-lead-helper.component';
import { RaidLookupComponent } from './raid-lookup/raid-lookup.component';
import { RaidSpamComponent } from './raid-spam/raid-spam.component';
import { SoftresManagerComponent } from './softres-manager/softres-manager.component';
import { SpecializationDataComponent } from './specialization-data/specialization-data.component';
import { SpecializationIconComponent } from './specialization-icon/specialization-icon.component';
import { VoaRaidBuilderComponent } from './voa-raid-builder/voa-raid-builder.component';
import { WowheadLinkComponent } from './wowhead-link/wowhead-link.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayerRankingsComponent,
    GuildLogComponent,
    GuildLogsSummaryComponent,
    WowheadLinkComponent,
    DashboardComponent,
    SpecializationDataComponent,
    SoftresManagerComponent,
    RaidLeadHelperComponent,
    RaidSelectionComponent,
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
    ServerSelectionComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    Json2TreeModule,
    SafePipeModule,
    SimpleModalModule,
    ToastrModule.forRoot({ positionClass: 'inline' }),
    ToastContainerModule
  ],
  providers: [
    {
      provide: AppConfig,
      useValue: new AppConfig()
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
