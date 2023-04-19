import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IGetMultipleCharacterZoneRankingsResponse, RankingMetric, WowClass } from 'classic-companion-core';
import { finalize } from 'rxjs';
import { RaidAndSizeSelection } from '../common/components/raid-size-selection/raid-and-size-selection';
import { CharacterService } from '../common/services/character/character.service';
import { IGetCharacterZoneRankings } from '../common/services/character/get-character-zone-rankings.interface';
import { RaidZoneAndSize } from '../common/services/raids/raid-zone-and-size.interface';
import { RaidService } from '../common/services/raids/raid.service';
import { SoftresRaidSlug } from '../common/services/softres/softres-raid-slug';
import { ThemeService } from '../common/services/theme/theme.service';
import { ToastService } from '../common/services/toast/toast.service';
import { RaidLookupViewModel } from './raid-lookup.viewmodel';
import { RaidPlayerRole } from './raid-player-role.type';
import { JsonRaidPlayer } from './raid-player.interface';

@Component({
  selector: 'app-raid-lookup',
  templateUrl: './raid-lookup.component.html',
  styleUrls: ['./raid-lookup.component.scss']
})
export class RaidLookupComponent implements OnInit, OnChanges {
  @Output() characterNameClicked: EventEmitter<string> = new EventEmitter<string>();
  @Input() raidAndSize: RaidAndSizeSelection = new RaidAndSizeSelection({
    raid: 'ulduar',
    size10: true,
    size25: false
  });
  importJson: string | undefined;
  raidRankingsLoading: boolean = false;
  viewModel: RaidLookupViewModel | undefined;
  classFilterInput: WowClass | undefined;
  roleFilterInput: RaidPlayerRole | undefined;
  roleFilterOptions: RaidPlayerRole[] = ['DAMAGER', 'HEALER', 'TANK'];

  constructor(
    private characterService: CharacterService,
    private raidService: RaidService,
    private toastService: ToastService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['classFilterInput'] || changes['roleFilterInput']) {
      this.viewModel?.filterData(this.classFilterInput, this.roleFilterInput);
    }
  }

  public onSearchClick(): void {
    if (!this.importJson) {
      this.toastService.warn(
        'Data Required',
        'Fill the Import textbox with data from the GME addon. You can download GME in the menu at the top right.'
      );
      return;
    }
    this.searchRaid(this.importJson);
  }

  public onCharacterNameClick(characterName: string): void {
    this.characterNameClicked.emit(characterName);
  }

  public searchRaid(json: string): void {
    let players: JsonRaidPlayer[];
    try {
      players = JSON.parse(json);
    } catch (err) {
      this.toastService.warn(
        'Invalid Data',
        'The data on clipboard is not valid json. Copy from the GME addon and try again.'
      );
      return;
    }

    if (players.find((player) => player.hasOwnProperty('roles'))) {
      this.toastService.warn(
        'Unsupported Data',
        'The data is in a new format, and can only be used with the new Raid Lookup.'
      );
      return;
    }

    this.importJson = json;

    // FIXME: Jesus, look at this method
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

    const queries: IGetCharacterZoneRankings[] = players.map((player) => {
      const query: IGetCharacterZoneRankings = {
        characterName: player.name,
        metric: this.getMetricFromRole(player.role),
        classSlug: player.classFileName,
        role: player.role,
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
        next: (response: IGetMultipleCharacterZoneRankingsResponse) => {
          this.viewModel = new RaidLookupViewModel(response.characters, this.themeService.theme, (value) =>
            this.onCharacterNameClick(value)
          );
          this.viewModel.filterData(this.classFilterInput, this.roleFilterInput);
        }
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
