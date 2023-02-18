import { Component, Input, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { IGetCharacterZoneRankingsResponse } from '../../../../models/api';
import { RankingMetric, RankingMetricValues } from '../../../../models/warcraft-logs';
import { RaidAndSizeSelection } from '../common/components/raid-size-selection/raid-size-selection.component';
import { CharacterService } from '../common/services/character.service';
import { RaidSize } from '../common/services/raids/raid-size.type';
import { RaidZoneAndSize } from '../common/services/raids/raid-zone-and-size.interface';
import { RaidService } from '../common/services/raids/raid.service';
import { RegionServerService } from '../common/services/region-server.service';
import { SoftresRaidSlug } from '../common/services/softres/softres-raid-slug';
import { ToastService } from '../common/services/toast.service';
import { PlayerLookupViewModel } from './player-lookup.viewmodel';

@Component({
  selector: 'app-player-lookup',
  templateUrl: './player-lookup.component.html',
  styleUrls: ['./player-lookup.component.scss']
})
export class PlayerLookupComponent implements OnInit {
  @Input() raidAndSize: RaidAndSizeSelection = new RaidAndSizeSelection({
    raid: 'ulduar',
    size10: true
  });
  characterNameInput: string | undefined;
  rankingMetricValues = RankingMetricValues;
  metricInput: RankingMetric = 'dps';
  zoneRankingsLoading: boolean = false;
  viewModel: PlayerLookupViewModel | undefined;

  constructor(
    private characterService: CharacterService,
    private raidService: RaidService,
    private toastService: ToastService,
    public regionServerService: RegionServerService
  ) {}

  ngOnInit(): void {}

  public onPlayerNameKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearchClick();
    }
  }

  public onSearchClick(): void {
    if (!this.characterNameInput) {
      alert('a character name must be specified'); // FIXME: Use toast, among other bullshit
      return;
    }
    this.searchPlayer(this.characterNameInput);
  }

  public onClearClick(): void {
    this.viewModel = undefined;
  }

  public searchPlayer(name: string) {
    this.characterNameInput = name;
    this.viewModel = undefined;

    if (!this.regionServerService.regionServer.regionSlug || !this.regionServerService.regionServer.serverSlug) {
      this.toastService.warn('Invalid Server', 'Choose your server at top of page'); // FIXME: Use toast, among other bullshit
      return;
    }

    const instanceSlug: SoftresRaidSlug | undefined = this.raidAndSize.getSoftResSlug();
    if (!instanceSlug) {
      this.toastService.warn('Invalid raid', 'Choose a raid and size');
      return;
    }
    const raidZoneAndSize: RaidZoneAndSize = this.raidService.getZoneAndSize(instanceSlug);
    this.zoneRankingsLoading = true;

    this.characterService
      .getZoneRankings({
        characterName: this.characterNameInput,
        metric: this.metricInput,
        serverRegion: this.regionServerService.regionServer.regionSlug,
        serverSlug: this.regionServerService.regionServer.serverSlug,
        zoneId: raidZoneAndSize.zoneId,
        size: this.raidAndSize.getSize() as RaidSize
      })
      .pipe(finalize(() => (this.zoneRankingsLoading = false)))
      .subscribe({
        next: (result: IGetCharacterZoneRankingsResponse) => (this.viewModel = new PlayerLookupViewModel(result)),
        error: (error) => {
          if (error.status === 400) {
            this.toastService.warn('Invalid Request', error.error.message);
            return;
          }
          if (error.status === 404) {
            this.toastService.warn('Character Not Found', `${this.characterNameInput} was not found on WarcraftLogs`);
            return;
          }
          throw error;
        }
      });
  }
}
