import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { finalize } from 'rxjs';
import { RaidAndSizeSelection } from '../common/components/raid-size-selection/raid-size-selection.component';
import { CharacterService } from '../common/services/character/character.service';
import { IGetMultipleCharacterZoneRankingsResponse } from '../common/services/character/get-multiple-character-zone-rankings-response.interface';
import { RankingMetric, ZoneRankingsQuery } from '../common/services/graphql';
import { RaidZoneAndSize } from '../common/services/raids/raid-zone-and-size.interface';
import { RaidService } from '../common/services/raids/raid.service';
import { RegionServerService } from '../common/services/region-server.service';
import { SoftresRaidSlug } from '../common/services/softres/softres-raid-slug';
import { ToastService } from '../common/services/toast.service';
import { RaidLookupViewModel } from './raid-lookup.viewmodel';
import { RaidPlayerRole } from './raid-player-role.type';
import { JsonRaidPlayer as GmeExportPlayer } from './raid-player.interface';

@Component({
  selector: 'app-raid-lookup',
  templateUrl: './raid-lookup.component.html',
  styleUrls: ['./raid-lookup.component.scss']
})
export class RaidLookupComponent implements OnInit {
  @Output() characterNameClicked: EventEmitter<string> = new EventEmitter<string>();
  @Input() raidAndSize: RaidAndSizeSelection = new RaidAndSizeSelection({
    raid: 'ulduar',
    size10: true,
    size25: false
  });
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
      this.toastService.warn('Missing Server', 'Choose your server at top of page');
      return;
    }

    if (!this.raidAndSize.hasRaidAndSize()) {
      this.toastService.warn('Invalid Search', 'Select a raid instance and size');
      return;
    }

    const raidSlugs: SoftresRaidSlug[] = this.raidAndSize.getSoftResSlugs();
    if (raidSlugs.length === 0) {
      this.toastService.error('Error', 'No raids found for provided data' + JSON.stringify(this.raidAndSize));
      return;
    }
    const raidZoneAndSize: RaidZoneAndSize = this.raidService.getZoneAndSize(raidSlugs[0]);

    let players: GmeExportPlayer[];
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
        classFileName: player.classFileName,
        role: player.role,
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
        next: (response: IGetMultipleCharacterZoneRankingsResponse) =>
          (this.viewModel = new RaidLookupViewModel(response.characters, (value) => this.onCharacterNameClick(value)))
      });
  }

  public onClearClick(): void {
    this.viewModel = undefined;
    this.importJson = undefined;
  }

  private getMetricFromRole(role: RaidPlayerRole): RankingMetric {
    switch (role) {
      case 'DAMAGER':
      case 'TANK':
        return 'dps';
      case 'HEALER':
        return 'hps';
    }
  }
}
