import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, Injector, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdsenseModule } from 'ng2-adsense';
import { SimpleModalModule } from 'ngx-simple-modal';
import { ToastContainerModule, ToastrModule } from 'ngx-toastr';
import { SafePipeModule } from 'safe-pipe';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { CardComponent } from './common/components/card/card.component';
import { ClassIconComponent } from './common/components/class-icon/class-icon.component';
import { ClassSelectionComponent } from './common/components/class-selection/class-selection.component';
import { ClassSpecSelectionComponent } from './common/components/class-spec-selection/class-spec-selection.component';
import { ConfirmModalComponent } from './common/components/confirm-modal/confirm-modal.component';
import { DropdownComponent } from './common/components/dropdown/dropdown.component';
import { GridComponent } from './common/components/grid/grid.component';
import { CopyIconComponent } from './common/components/icons/copy-icon/copy-icon.component';
import { InstanceSizeSelectionComponent } from './common/components/instance-size-selection/instance-size-selection.component';
import { ItemSelectionComponent } from './common/components/item-selection/item-selection.component';
import { ParseNumberComponent } from './common/components/parse-number/parse-number.component';
import { RoleIconComponent } from './common/components/role-icon/role-icon.component';
import { ServerSelectionComponent } from './common/components/server-selection/server-selection.component';
import { SvgIconComponent } from './common/components/svg-icon/svg-icon.component';
import { WclLinkIconComponent } from './common/components/wcl-link-icon/wcl-link-icon.component';
import { WowheadLinkComponent } from './common/components/wowhead-link/wowhead-link.component';
import { KonamiModule } from './common/directives/konami/konami.module';
import { ThemeDirective } from './common/directives/theme/theme.directive';
import { GlobalErrorHandler } from './common/global-error-handler';
import { GlobalHttpInterceptor } from './common/global-http-interceptor';
import { MaintenanceAuthGuard } from './common/guards/maintenance.auth-guard';
import { AppConfig } from './config/app.config';
import { CreateSoftresModalComponent } from './create-softres-modal/create-softres-modal.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GettingStartedComponent } from './getting-started/getting-started.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { MyCharacterGearCompareComponent } from './my-characters/my-character-gear-compare/my-character-gear-compare.component';
import { MyCharacterImportModalComponent } from './my-characters/my-character-import-modal/my-character-import-modal.component';
import { MyCharacterListComponent } from './my-characters/my-character-list/my-character-list.component';
import { EditLockoutModalComponent } from './my-characters/my-characters-lockouts/edit-lockout-modal/edit-lockout-modal.component';
import { MyCharactersLockoutsComponent } from './my-characters/my-characters-lockouts/my-characters-lockouts.component';
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
    PlayerRaidStatsComponent,
    ClassSpecSelectionComponent,
    ClassSelectionComponent,
    DropdownComponent,
    WclLinkIconComponent,
    CopyIconComponent,
    PlayerComparisonComponent,
    MyCharactersComponent,
    MyCharacterListComponent,
    MyCharactersRankingsComponent,
    MyCharacterImportModalComponent,
    MyCharacterGearCompareComponent,
    SvgIconComponent,
    GettingStartedComponent,
    RaidLookupComponent,
    MaintenanceComponent,
    ThemeDirective,
    ClassIconComponent,
    RoleIconComponent,
    InstanceSizeSelectionComponent,
    MyCharactersLockoutsComponent,
    EditLockoutModalComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    KonamiModule,
    SafePipeModule,
    SimpleModalModule,
    AdsenseModule.forRoot({
      adClient: 'ca-pub-7060933792284068',
      adSlot: 8056599129,
      adFormat: 'auto',
      fullWidthResponsive: true
    }),
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
      useClass: AppConfig
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalHttpInterceptor,
      multi: true,
      deps: [AppConfig, AuthService, Injector]
    },
    MaintenanceAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
