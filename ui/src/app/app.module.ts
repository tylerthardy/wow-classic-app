import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleModalModule } from 'ngx-simple-modal';
import { ToastContainerModule, ToastrModule } from 'ngx-toastr';
import { SafePipeModule } from 'safe-pipe';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { CardComponent } from './common/components/card/card.component';
import { ClassSelectionComponent } from './common/components/class-selection/class-selection.component';
import { ClassSpecSelectionComponent } from './common/components/class-spec-selection/class-spec-selection.component';
import { ConfirmModalComponent } from './common/components/confirm-modal/confirm-modal.component';
import { DropdownComponent } from './common/components/dropdown/dropdown.component';
import { GridComponent } from './common/components/grid/grid.component';
import { CopyIconComponent } from './common/components/icons/copy-icon/copy-icon.component';
import { ItemSelectionComponent } from './common/components/item-selection/item-selection.component';
import { ParseNumberComponent } from './common/components/parse-number/parse-number.component';
import { RaidSizeSelectionComponent } from './common/components/raid-size-selection/raid-size-selection.component';
import { ServerSelectionComponent } from './common/components/server-selection/server-selection.component';
import { WclLinkIconComponent } from './common/components/wcl-link-icon/wcl-link-icon.component';
import { WowheadLinkComponent } from './common/components/wowhead-link/wowhead-link.component';
import { GlobalErrorHandler } from './common/global-error-handler';
import { CreateSoftresModalComponent } from './create-softres-modal/create-softres-modal.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyCharacterImportModalComponent } from './my-characters/my-character-import-modal/my-character-import-modal.component';
import { MyCharactersRankingsComponent } from './my-characters/my-characters-rankings/my-characters-rankings.component';
import { MyCharactersComponent } from './my-characters/my-characters.component';
import { PlayerComparisonComponent } from './player-comparison/player-comparison.component';
import { PlayerLookupComponent } from './player-lookup/player-lookup.component';
import { PlayerRaidStatsComponent } from './player-lookup/player-raid-stats/player-raid-stats.component';
import { RaidInformationComponent } from './raid-information/raid-information.component';
import { RaidLeadHelperComponent } from './raid-lead-helper/raid-lead-helper.component';
import { RaidLookupComponent } from './raid-lookup/raid-lookup.component';
import { RaidSpamComponent } from './raid-spam/raid-spam.component';
import { SoftresManagerComponent } from './softres-manager/softres-manager.component';
import { SpecializationDataComponent } from './specialization-data/specialization-data.component';
import { SpecializationIconComponent } from './specialization-icon/specialization-icon.component';
import { VoaRaidBuilderComponent } from './voa-raid-builder/voa-raid-builder.component';
import { MyCharacterGearCompareComponent } from './my-characters/my-character-gear-compare/my-character-gear-compare.component';

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
    RaidSizeSelectionComponent,
    PlayerRaidStatsComponent,
    ClassSpecSelectionComponent,
    ClassSelectionComponent,
    DropdownComponent,
    WclLinkIconComponent,
    CopyIconComponent,
    PlayerComparisonComponent,
    MyCharactersComponent,
    MyCharactersRankingsComponent,
    MyCharacterImportModalComponent,
    MyCharacterGearCompareComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
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
