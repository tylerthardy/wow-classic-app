import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GuildLogComponent } from './guild-log/guild-log.component';
import { GuildLogsSummaryComponent } from './guild-logs-summary/guild-logs-summary.component';
import { PlayerRankingsComponent } from './player-rankings/player-rankings.component';
import { RaidLeadHelperComponent } from './raid-lead-helper/raid-lead-helper.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'player-rankings',
    component: PlayerRankingsComponent
  },
  {
    path: 'guild-log',
    component: GuildLogComponent
  },
  {
    path: 'guild-logs-summary',
    component: GuildLogsSummaryComponent
  },
  {
    path: 'raid-lead-helper',
    component: RaidLeadHelperComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
