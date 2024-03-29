import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceAuthGuard } from './common/guards/maintenance.auth-guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { MyCharactersComponent } from './my-characters/my-characters.component';
import { PlayerComparisonComponent } from './player-comparison/player-comparison.component';
import { RaidLeadHelperComponent } from './raid-lead-helper/raid-lead-helper.component';

export const navigation = [
  {
    title: 'Dashboard',
    routerLink: ['dashboard']
  },
  // {
  //   title: 'Raid Lead Helper',
  //   routerLink: ['raid-lead-helper']
  // },
  {
    title: 'Player Comparison',
    routerLink: ['player-comparison']
  },
  {
    title: 'My Characters',
    routerLink: ['my-characters']
  }
];

export const routes: Routes = [
  {
    path: '',
    canActivate: [MaintenanceAuthGuard],
    children: [
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
        path: 'raid-lead-helper',
        component: RaidLeadHelperComponent
      },
      {
        path: 'player-comparison',
        component: PlayerComparisonComponent
      },
      {
        path: 'my-characters',
        component: MyCharactersComponent
      }
    ]
  },
  {
    path: 'maintenance',
    component: MaintenanceComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
