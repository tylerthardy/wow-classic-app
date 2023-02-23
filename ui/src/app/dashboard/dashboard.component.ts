import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../environments/environment';
import { PlayerLookupComponent } from '../player-lookup/player-lookup.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public isDevelopment: boolean = !environment.production;
  @ViewChild('playerLookup') playerLookupRef!: PlayerLookupComponent;

  constructor() {}

  ngOnInit(): void {}

  public onRaidCharacterNameClicked(characterName: string): void {
    this.playerLookupRef.searchPlayer(characterName);
    document.getElementById('dashboard-player-lookup')?.scrollIntoView();
  }
}
