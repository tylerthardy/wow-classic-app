import { Component, Input, OnInit } from '@angular/core';
import { finalize, forkJoin, Observable } from 'rxjs';
import { RaidAndSizeSelection } from '../common/components/raid-size-selection/raid-size-selection.component';
import { CharacterService } from '../common/services/character/character.service';
import { IGetCharacterZoneRankingsResponse } from '../common/services/character/get-character-zone-rankings-response.interface';
import { RankingMetric, RankingMetricValues } from '../common/services/graphql';
import { RaidSize } from '../common/services/raids/raid-size.type';
import { RaidZoneAndSize } from '../common/services/raids/raid-zone-and-size.interface';
import { RaidService } from '../common/services/raids/raid.service';
import { RegionServerService } from '../common/services/region-server.service';
import { SoftresRaidSlug } from '../common/services/softres/softres-raid-slug';
import { ToastService } from '../common/services/toast.service';
import { PlayerLookupViewModel } from './player-lookup.viewmodel';
import { TwoRaidPlayerLookupViewModel } from './two-raid-player-lookup.viewmodel';

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
  isLoading: boolean = false;
  viewModel: PlayerLookupViewModel | undefined;
  twoRaidViewModel: TwoRaidPlayerLookupViewModel | undefined;
  columnOrder: number = 1;

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
    this.twoRaidViewModel = undefined;
    this.characterNameInput = undefined;
  }

  public searchPlayer(name: string) {
    this.characterNameInput = name;
    this.viewModel = undefined;
    this.twoRaidViewModel = undefined;

    if (!this.regionServerService.regionServer.regionSlug || !this.regionServerService.regionServer.serverSlug) {
      this.toastService.warn('Invalid Server', 'Choose your server at top of page'); // FIXME: Use toast, among other bullshit
      return;
    }

    const instanceSlugs: SoftresRaidSlug[] = this.raidAndSize.getSoftResSlugs();
    if (!instanceSlugs || instanceSlugs.length === 0) {
      this.toastService.warn('Invalid raid', 'Choose a raid and size');
      return;
    }
    const zonesAndSizes: RaidZoneAndSize[] = instanceSlugs.map((instanceSlug: SoftresRaidSlug) =>
      this.raidService.getZoneAndSize(instanceSlug)
    );

    if (zonesAndSizes.length > 1) {
      this.performMultipleRaidSearch(zonesAndSizes);
      return;
    }

    this.isLoading = true;
    this.getSearchObservable(zonesAndSizes[0].zoneId, zonesAndSizes[0].size)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (result: IGetCharacterZoneRankingsResponse) => (this.viewModel = new PlayerLookupViewModel(result)),
        error: (err) => this.handleError(err)
      });
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
    return this.characterService.getZoneRankings({
      characterName: this.characterNameInput!,
      metric: this.metricInput!,
      serverRegion: this.regionServerService.regionServer.regionSlug!,
      serverSlug: this.regionServerService.regionServer.serverSlug!,
      zoneId: zoneId,
      size: size
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
          this.twoRaidViewModel = new TwoRaidPlayerLookupViewModel(response10, response25, this.columnOrder);
        },
        error: (err) => this.handleError(err)
      });
  }
}
