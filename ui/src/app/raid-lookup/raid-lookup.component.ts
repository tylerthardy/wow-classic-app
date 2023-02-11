import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { finalize } from 'rxjs';
import { CharacterService } from '../common/services/character.service';
import { CharacterZoneRankings, Metric, ZoneRankingsQuery } from '../common/services/graphql';
import { RaidZoneAndSize } from '../common/services/raids/raid-zone-and-size.interface';
import { RaidService } from '../common/services/raids/raid.service';
import { RegionServerService } from '../common/services/region-server.service';
import { SoftresRaidSlug } from '../common/services/softres/softres-raid-slug';
import { ToastService } from '../common/services/toast.service';
import { RaidLookupViewModel } from './raid-lookup.viewmodel';
import { RaidPlayerRole } from './raid-player-role.type';
import { RaidPlayer } from './raid-player.interface';

@Component({
  selector: 'app-raid-lookup',
  templateUrl: './raid-lookup.component.html',
  styleUrls: ['./raid-lookup.component.scss']
})
export class RaidLookupComponent implements OnInit {
  @Output() characterNameClicked: EventEmitter<string> = new EventEmitter<string>();
  @Input() instanceInput: SoftresRaidSlug = 'ulduar10';
  importJson: string | undefined;
  raidRankingsLoading: boolean = false;
  viewModel: RaidLookupViewModel | undefined;

  constructor(
    private characterService: CharacterService,
    private raidService: RaidService,
    private regionServerService: RegionServerService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {}

  public onSearchClick(): void {
    if (!this.importJson) {
      alert('JSON is required in the import field');
      return;
    }
    this.searchRaid(this.importJson);
  }

  public onCharacterNameClick(characterName: string): void {
    this.characterNameClicked.emit(characterName);
  }

  public searchRaid(json: string): void {
    this.importJson = json;

    // FIXME: Jesus, look at this method
    if (!this.regionServerService.regionServer.regionSlug || !this.regionServerService.regionServer.serverSlug) {
      alert('choose your server at top of page'); // FIXME: Use toast, among other bullshit
      return;
    }

    const raidZoneAndSize: RaidZoneAndSize = this.raidService.getZoneAndSize(this.instanceInput);

    let players: RaidPlayer[];
    try {
      players = JSON.parse(this.importJson);
    } catch (err: any) {
      const error = err as Error;
      this.toastService.error('Error while parsing players json', error.toString());
      return;
    }

    const queries: ZoneRankingsQuery[] = players.map((player) => {
      const query: ZoneRankingsQuery = {
        characterName: player.name,
        metric: this.getMetricFromRole(player.role),
        serverRegion: 'us',
        serverSlug: 'benediction',
        zoneId: raidZoneAndSize.zoneId,
        size: raidZoneAndSize.size
      };
      return query;
    });

    this.raidRankingsLoading = true;
    this.characterService
      .getMultipleZoneRankings(queries)
      .pipe(finalize(() => (this.raidRankingsLoading = false)))
      .subscribe({
        next: (result: CharacterZoneRankings[]) =>
          (this.viewModel = new RaidLookupViewModel(result, players, (value) => this.onCharacterNameClick(value)))
      });
  }

  public onClearClick(): void {
    this.viewModel = undefined;
  }

  private getMetricFromRole(role: RaidPlayerRole): Metric {
    switch (role) {
      case 'DAMAGER':
      case 'TANK':
        return 'dps';
      case 'HEALER':
        return 'hps';
    }
  }
}
