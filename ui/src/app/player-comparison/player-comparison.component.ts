import { Component, Input, OnInit } from '@angular/core';
import { Instances, RankingMetric, RankingMetricValues, SpecializationData, WowClass } from 'classic-companion-core';
import { finalize, forkJoin } from 'rxjs';
import { IInstanceSizeSelection } from '../common/components/instance-size-selection/instance-size-selection.interface';
import { RaidAndSizeSelection } from '../common/components/instance-size-selection/raid-and-size-selection';
import { CharacterService } from '../common/services/character/character.service';
import { IGetCharacterZoneRankings } from '../common/services/character/get-character-zone-rankings.interface';
import { RaidZoneAndSize } from '../common/services/raids/raid-zone-and-size.interface';
import { RaidService } from '../common/services/raids/raid.service';
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
  @Input() public instanceSizeSelection: IInstanceSizeSelection = { instance: Instances.ToGC, sizes: [25] };
  get raidAndSize(): RaidAndSizeSelection {
    return RaidAndSizeSelection.fromInstanceSizeSelection(this.instanceSizeSelection);
  }
  player1NameInput: string | undefined;
  player2NameInput: string | undefined;
  rankingMetricValues = RankingMetricValues;
  metricInput: RankingMetric = 'dps';
  isLoading: boolean = false;
  viewModel: PlayerComparisonViewModel | undefined;
  wowClassFilter: WowClass | undefined;
  specializationFilter: SpecializationData | undefined;

  constructor(
    private toastService: ToastService,
    private raidService: RaidService,
    private characterService: CharacterService,
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

  public onClassChange(wowClass: WowClass | undefined): void {
    this.specializationFilter = undefined;
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
    const theme: Theme = this.themeService.theme;
    const queries: IGetCharacterZoneRankings[] = [
      {
        characterName: player1Name,
        metric: this.metricInput,
        size: zonesAndSizes[0].size,
        zoneId: zonesAndSizes[0].zoneId
      },
      {
        characterName: player2Name,
        metric: this.metricInput,
        size: zonesAndSizes[0].size,
        zoneId: zonesAndSizes[0].zoneId
      }
    ];
    if (this.specializationFilter) {
      const specName: string = this.specializationFilter.name;
      queries.forEach((query) => {
        query.specName = specName;
      });
    }

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
