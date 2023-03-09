import { Component, OnInit } from '@angular/core';
import { finalize, forkJoin } from 'rxjs';
import { RaidAndSizeSelection } from '../common/components/raid-size-selection/raid-and-size-selection';
import { CharacterService } from '../common/services/character/character.service';
import { RankingMetric, RankingMetricValues, ZoneRankingsQuery } from '../common/services/graphql';
import { RaidZoneAndSize } from '../common/services/raids/raid-zone-and-size.interface';
import { RaidService } from '../common/services/raids/raid.service';
import { RegionServerService } from '../common/services/region-server.service';
import { SoftresRaidSlug } from '../common/services/softres/softres-raid-slug';
import { ThemeService } from '../common/services/theme/theme.service';
import { Theme } from '../common/services/theme/theme.type';
import { ToastService } from '../common/services/toast/toast.service';
import { PlayerLookupViewModel } from '../player-lookup/player-lookup.viewmodel';
import { PlayerComparisonViewModel } from './player-comparison.viewmodel';

@Component({
  selector: 'app-player-comparison',
  templateUrl: './player-comparison.component.html',
  styleUrls: ['./player-comparison.component.scss']
})
export class PlayerComparisonComponent implements OnInit {
  raidAndSize: RaidAndSizeSelection = new RaidAndSizeSelection({
    raid: 'ulduar',
    size10: true
  });
  player1NameInput: string | undefined;
  player2NameInput: string | undefined;
  rankingMetricValues = RankingMetricValues;
  metricInput: RankingMetric = 'dps';
  isLoading: boolean = false;
  viewModel: PlayerComparisonViewModel | undefined;

  constructor(
    private toastService: ToastService,
    private raidService: RaidService,
    private characterService: CharacterService,
    private regionServerService: RegionServerService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {}

  public onPlayerNameKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearchClick();
    }
  }

  public onSearchClick(): void {
    if (!this.player1NameInput || !this.player2NameInput) {
      this.toastService.warn('Invalid Characters', 'Both character names must be specified');
      return;
    }
    this.comparePlayers(this.player1NameInput, this.player2NameInput);
  }

  public onClearClick(): void {
    this.viewModel = undefined;
    this.clearViewModel();
  }

  public clearViewModel() {
    this.viewModel = undefined;
  }

  public comparePlayers(player1Name: string, player2Name: string) {
    // TODO: Fix this crap having to be duplicated everywhere. Normalize raid concepts
    const instanceSlugs: SoftresRaidSlug[] = this.raidAndSize.getSoftResSlugs();
    if (!instanceSlugs || instanceSlugs.length === 0) {
      this.toastService.warn('Invalid raid', 'Choose a raid and size');
      return;
    }
    const zonesAndSizes: RaidZoneAndSize[] = instanceSlugs.map((instanceSlug: SoftresRaidSlug) =>
      this.raidService.getZoneAndSize(instanceSlug)
    );
    // TODO: Move the region logic into the character service since its required by all character calls
    if (!this.regionServerService.regionServer.regionSlug || !this.regionServerService.regionServer.serverSlug) {
      this.toastService.warn('Invalid Server', 'Choose your server at top of page');
      return;
    }
    const theme: Theme = this.themeService.theme;
    const queries: ZoneRankingsQuery[] = [
      {
        characterName: player1Name,
        metric: this.metricInput,
        serverRegion: this.regionServerService.regionServer.regionSlug!,
        serverSlug: this.regionServerService.regionServer.serverSlug!,
        size: zonesAndSizes[0].size,
        zoneId: zonesAndSizes[0].zoneId
      },
      {
        characterName: player2Name,
        metric: this.metricInput,
        serverRegion: this.regionServerService.regionServer.regionSlug!,
        serverSlug: this.regionServerService.regionServer.serverSlug!,
        size: zonesAndSizes[0].size,
        zoneId: zonesAndSizes[0].zoneId
      }
    ];

    this.isLoading = true;
    forkJoin(queries.map((query) => this.characterService.getZoneRankings(query)))
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((response) => {
        const player1 = new PlayerLookupViewModel(response[0], theme);
        const player2 = new PlayerLookupViewModel(response[1], theme);
        this.viewModel = new PlayerComparisonViewModel(player1, player2, theme);
      });
  }
}