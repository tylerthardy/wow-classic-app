import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../environments/environment';
import { AppConfig } from '../config/app.config';
import { PlayerLookupComponent } from '../player-lookup/player-lookup.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public isDevelopment: boolean = !environment.production;
  public konamiMode: boolean = false;
  @ViewChild('playerLookup') playerLookupRef!: PlayerLookupComponent;

  constructor(public appConfig: AppConfig) {}

  ngOnInit(): void {
    var dashboardContainer = document.getElementsByClassName('dashboard-container')[0] as HTMLDivElement;
    const observerDashboard = new MutationObserver(function (mutations, observer) {
      dashboardContainer.style.height = '';
    });
    observerDashboard.observe(dashboardContainer, {
      attributes: true,
      attributeFilter: ['style']
    });
  }

  public onRaidCharacterNameClicked(characterName: string): void {
    this.playerLookupRef.searchPlayer(characterName);
    document.getElementById('dashboard-player-lookup')?.scrollIntoView();
  }

  public onKonami(): void {
    this.konamiMode = !this.konamiMode;
  }
}
