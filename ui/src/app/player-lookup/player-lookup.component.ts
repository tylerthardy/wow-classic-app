import { Component, Input, OnInit } from '@angular/core';
import {
  IGetCharacterZoneRankingsResponse,
  RankingMetric,
  RankingMetricValues,
  SpecializationData
} from 'classic-companion-core';
import { finalize, forkJoin, Observable } from 'rxjs';
import { RaidAndSizeSelection } from '../common/components/raid-size-selection/raid-and-size-selection';
import { CharacterService } from '../common/services/character/character.service';
import { IGetCharacterZoneRankings } from '../common/services/character/get-character-zone-rankings.interface';
import { RaidSize } from '../common/services/raids/raid-size.type';
import { RaidZoneAndSize } from '../common/services/raids/raid-zone-and-size.interface';
import { RaidService } from '../common/services/raids/raid.service';
import { SoftresRaidSlug } from '../common/services/softres/softres-raid-slug';
import { ThemeService } from '../common/services/theme/theme.service';
import { ToastService } from '../common/services/toast/toast.service';
import { CompactPlayerLookupViewModel } from './compact-player-lookup.viewmodel';
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
  specFilter: SpecializationData | undefined;
  isLoading: boolean = false;
  viewModel: PlayerLookupViewModel | undefined;
  viewModel10: CompactPlayerLookupViewModel | undefined;
  viewModel25: CompactPlayerLookupViewModel | undefined;

  constructor(
    private characterService: CharacterService,
    private raidService: RaidService,
    private toastService: ToastService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {}

  public onPlayerNameKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearchClick();
    }
  }

  public onSearchClick(): void {
    if (!this.characterNameInput) {
      this.toastService.warn('Invalid Character', 'A character name must be specified');
      return;
    }
    this.searchPlayer(this.characterNameInput);
  }

  public onClearClick(): void {
    this.viewModel = undefined;
    this.clearViewModels();
  }

  public onSpecChanged(spec: SpecializationData): void {
    this.searchPlayer(this.characterNameInput!);
  }

  public searchPlayer(name: string) {
    if (this.viewModel?.characterName.toLowerCase() !== name.toLowerCase()) {
      this.specFilter = undefined;
    }
    this.clearViewModels();
    this.characterNameInput = name;

    const instanceSlugs: SoftresRaidSlug[] = this.raidAndSize.getSoftResSlugs();
    if (!instanceSlugs || instanceSlugs.length === 0) {
      this.toastService.warn('Invalid raid', 'Choose a raid and size');
      return;
    }
    const zonesAndSizes: RaidZoneAndSize[] = instanceSlugs.map((instanceSlug: SoftresRaidSlug) =>
      this.raidService.getZoneAndSize(instanceSlug)
    );

    if (zonesAndSizes.length === 1) {
      this.performSingleRaidSearch(zonesAndSizes[0]);
    } else {
      this.performMultipleRaidSearch(zonesAndSizes);
    }
  }

  private clearViewModels() {
    this.viewModel = undefined;
    this.viewModel10 = undefined;
    this.viewModel25 = undefined;
  }

  private handleError(error: any): void {
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

  private getSearchObservable(zoneId: number, size: RaidSize): Observable<IGetCharacterZoneRankingsResponse> {
    const request: IGetCharacterZoneRankings = {
      characterName: this.characterNameInput!,
      metric: this.metricInput!,
      zoneId: zoneId,
      size: size
    };
    if (this.specFilter) {
      request.specName = this.specFilter.name;
    }
    return this.characterService.getZoneRankings(request);
  }

  private performSingleRaidSearch(zoneAndSize: RaidZoneAndSize): void {
    this.isLoading = true;
    this.getSearchObservable(zoneAndSize.zoneId, zoneAndSize.size)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (result: IGetCharacterZoneRankingsResponse) =>
          (this.viewModel = new PlayerLookupViewModel(result, this.themeService.theme)),
        error: (err) => this.handleError(err)
      });
  }

  private performMultipleRaidSearch(zonesAndSizes: RaidZoneAndSize[]): void {
    const observables: Observable<IGetCharacterZoneRankingsResponse>[] = zonesAndSizes.map(
      (zoneAndSize: RaidZoneAndSize) => this.getSearchObservable(zoneAndSize.zoneId, zoneAndSize.size)
    );
    this.isLoading = true;
    forkJoin(observables)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (responses: IGetCharacterZoneRankingsResponse[]) => {
          const response10: IGetCharacterZoneRankingsResponse = responses.find((response) => response.size === 10)!;
          const response25: IGetCharacterZoneRankingsResponse = responses.find((response) => response.size === 25)!;
          if (response10) {
            this.viewModel10 = new CompactPlayerLookupViewModel(response10, this.themeService.theme);
          }
          if (response25) {
            this.viewModel25 = new CompactPlayerLookupViewModel(response25, this.themeService.theme);
          }
        },
        error: (err) => this.handleError(err)
      });
  }
}
