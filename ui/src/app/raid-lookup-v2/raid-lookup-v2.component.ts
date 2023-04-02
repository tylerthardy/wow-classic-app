import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  IGetCharacterZoneRankingsResponse,
  IGetMultipleCharacterZoneRankingsResponse,
  WowClass
} from 'classic-companion-core';
import { finalize } from 'rxjs';
import { ColumnSpecification } from '../common/components/grid/grid.component';
import { RaidAndSizeSelection } from '../common/components/raid-size-selection/raid-and-size-selection';
import { CharacterService } from '../common/services/character/character.service';
import { ZoneRankingsQuery } from '../common/services/graphql';
import { RaidZoneAndSize } from '../common/services/raids/raid-zone-and-size.interface';
import { RaidService } from '../common/services/raids/raid.service';
import { RegionServerService } from '../common/services/region-server.service';
import { SoftresRaidSlug } from '../common/services/softres/softres-raid-slug';
import { ThemeService } from '../common/services/theme/theme.service';
import { Theme } from '../common/services/theme/theme.type';
import { ToastService } from '../common/services/toast/toast.service';
import { ParseUtil } from '../common/utils';
import { RaidPlayerRole } from '../raid-lookup/raid-player-role.type';
import { JsonRaidPlayer, JsonRaidPlayerV2 } from '../raid-lookup/raid-player.interface';
import { RaidLookupCharacter } from './raid-lookup-character';

@Component({
  selector: 'app-raid-lookup-v2',
  templateUrl: './raid-lookup-v2.component.html',
  styleUrls: ['./raid-lookup-v2.component.scss']
})
export class RaidLookupV2Component implements OnInit {
  @Output() public characterNameClicked: EventEmitter<string> = new EventEmitter<string>();
  @Input() public raidAndSize: RaidAndSizeSelection = new RaidAndSizeSelection({
    raid: 'ulduar',
    size10: true,
    size25: false
  });
  protected importJson: string | undefined;
  protected classFilterInput: WowClass | undefined;
  protected roleFilterInput: RaidPlayerRole | undefined;
  protected roleFilterOptions: RaidPlayerRole[] = ['DAMAGER', 'HEALER', 'TANK'];

  protected characters: RaidLookupCharacter[] = [];
  protected filteredCharacters: RaidLookupCharacter[] = [];
  protected erroredCharacters: RaidLookupCharacter[] = [];
  protected raidRankingsLoading: boolean = false;
  protected columns!: ColumnSpecification<RaidLookupCharacter>[];

  constructor(
    private characterService: CharacterService,
    private raidService: RaidService,
    private regionServerService: RegionServerService,
    private toastService: ToastService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.columns = this.getColumns(this.themeService.theme);
  }

  protected onFilterChanged(): void {
    this.filterData(this.classFilterInput, this.roleFilterInput);
  }

  protected onSearchClick(): void {
    if (!this.importJson) {
      this.toastService.warn(
        'Data Required',
        'Fill the Import textbox with data from the GME addon. You can download GME in the menu at the top right.'
      );
      return;
    }
    this.searchRaid(this.importJson);
  }

  protected onClearClick(): void {
    this.importJson = undefined;
    this.clearCharacterData();
  }

  protected onCharacterNameClick(characterName: string): void {
    this.characterNameClicked.emit(characterName);
  }

  public searchRaid(json: string): void {
    let importedCharacters: JsonRaidPlayer[] | JsonRaidPlayerV2[];
    try {
      importedCharacters = JSON.parse(json);
    } catch (err) {
      this.toastService.warn(
        'Invalid Data',
        'The data on clipboard is not valid json. Copy from the GME addon and try again.'
      );
      return;
    }

    this.importJson = json;

    // FIXME: Move this check to the API
    if (!this.regionServerService.regionServer.regionSlug || !this.regionServerService.regionServer.serverSlug) {
      this.toastService.warn('Missing Server', 'Choose your server at top of page');
      return;
    }

    if (!this.raidAndSize.hasRaidAndSize()) {
      this.toastService.warn('Invalid Search', 'Select a raid instance and size');
      return;
    }

    // FIXME: START: These should be simple methods on the object
    const raidSlugs: SoftresRaidSlug[] = this.raidAndSize.getSoftResSlugs();
    if (raidSlugs.length === 0) {
      this.toastService.error('Error', 'No raids found for provided data' + JSON.stringify(this.raidAndSize));
      return;
    }
    const raidZoneAndSize: RaidZoneAndSize = this.raidService.getZoneAndSize(raidSlugs[0]);
    // FIXME: END: These should be simple methods on the object

    this.clearCharacterData();

    let queries: ZoneRankingsQuery[] = [];
    for (let importedCharacter of importedCharacters) {
      const raidCharacter: RaidLookupCharacter = new RaidLookupCharacter(importedCharacter, raidZoneAndSize);
      this.characters.push(raidCharacter);

      const query: ZoneRankingsQuery = {
        characterName: raidCharacter.name,
        metric: raidCharacter.metric,
        classFileName: raidCharacter.class,
        role: raidCharacter.role,
        serverRegion: this.regionServerService.regionServer.regionSlug,
        serverSlug: this.regionServerService.regionServer.serverSlug,
        zoneId: raidZoneAndSize.zoneId,
        size: raidZoneAndSize.size
      };
      queries.push(query);
    }

    this.raidRankingsLoading = true;
    this.characterService
      .getMultipleZoneRankings(queries)
      .pipe(finalize(() => (this.raidRankingsLoading = false)))
      .subscribe({
        next: (response: IGetMultipleCharacterZoneRankingsResponse) => {
          if (response.characters.length !== this.characters.length) {
            throw new Error('Response length mismatch');
          }
          for (let i = 0; i < response.characters.length; i++) {
            const rankingData = response.characters[i];
            const character = this.characters[i];
            character.updateRankingData(rankingData);
          }
          this.filterData(this.classFilterInput, this.roleFilterInput);
        }
      });
  }

  private clearCharacterData(): void {
    this.characters = [];
    this.filteredCharacters = [];
    this.erroredCharacters = [];
  }

  private filterData(classFilter: WowClass | undefined, roleFilter: RaidPlayerRole | undefined): void {
    this.filteredCharacters = this.getFilteredData(classFilter, roleFilter);
    this.erroredCharacters = this.getErroredData();
  }

  private getFilteredData(
    classFilter: WowClass | undefined,
    roleFilter: RaidPlayerRole | undefined
  ): RaidLookupCharacter[] {
    let resultingData: RaidLookupCharacter[] = Object.assign([], this.characters);
    if (classFilter) {
      resultingData = resultingData.filter((d) => !d.class || d.class === classFilter.getClassFileName());
    }
    if (roleFilter) {
      resultingData = resultingData.filter((d) => !d.role || d.role === roleFilter);
    }
    return resultingData.filter((d) => !d.errors || d.errors.length === 0);
  }

  private getErroredData(): RaidLookupCharacter[] {
    return this.characters.filter((d) => d.errors && d.errors.length > 0);
  }

  private onLastUpdatedRefreshClick(character: RaidLookupCharacter): void {
    character.lastUpdatedChanging = true;
    const query: ZoneRankingsQuery = {
      characterName: character.characterName,
      serverSlug: this.regionServerService.regionServer.serverSlug!,
      serverRegion: this.regionServerService.regionServer.regionSlug!,
      zoneId: character.raidZoneAndSize.zoneId,
      metric: character.metric,
      size: character.raidZoneAndSize.size
    };
    this.characterService
      .getZoneRankings(query)
      .pipe(finalize(() => (character.lastUpdatedChanging = false)))
      .subscribe({
        next: (response: IGetCharacterZoneRankingsResponse) => {
          character.updateSingleRankingData(response);
          this.filterData(this.classFilterInput, this.roleFilterInput);
        }
      });
  }

  private getColumns(theme: Theme): ColumnSpecification<RaidLookupCharacter>[] {
    return [
      {
        label: 'WL',
        valueKey: 'characterName',
        sortType: 'string',
        format: {
          type: 'wcl-link'
        }
      },
      {
        label: 'Player',
        valueKey: 'characterName',
        sortType: 'string',
        style: {
          cursor: 'pointer'
        },
        onClick: (value: string) => this.onCharacterNameClick(value)
      },
      {
        label: 'Class',
        valueKey: 'class',
        sortType: 'string'
      },
      {
        label: 'Role',
        valueKey: 'role',
        sortType: 'string'
      },
      {
        label: 'Metric',
        valueKey: 'metric',
        sortType: 'string',
        transform: (rowValue) => {
          return rowValue.metric.toUpperCase();
        }
      },
      {
        label: 'Best Perf. Avg',
        valueKey: 'bestPerformanceAverage',
        sortType: 'number',
        format: {
          type: 'parse'
        },
        transform: (rowValue) => {
          return { value: rowValue.bestPerformanceAverage };
        },
        style: (rowValue) => {
          return { 'background-color': ParseUtil.getParseWarningColor(rowValue.bestPerformanceAverage, theme) };
        }
      },
      {
        label: 'Med Perf. Avg',
        valueKey: 'medianPerformanceAverage',
        sortType: 'number',
        format: {
          type: 'parse'
        },
        transform: (rowValue) => {
          return { value: rowValue.medianPerformanceAverage };
        },
        style: (rowValue) => {
          return { 'background-color': ParseUtil.getParseWarningColor(rowValue.medianPerformanceAverage, theme) };
        }
      },
      {
        label: 'Best Progress',
        valueKey: 'bestProgress',
        sortType: 'number',
        format: {
          type: 'custom',
          customFormat: (rowValue) => {
            if (!rowValue.bestProgress) {
              return '';
            }
            return `${rowValue.bestProgress}/${rowValue.maxPossibleProgress}`;
          }
        }
      },
      {
        label: 'Best HM',
        valueKey: 'bestHardModeProgress',
        sortType: 'number',
        format: {
          type: 'custom',
          customFormat: (rowValue) => {
            if (!rowValue.bestHardModeProgress) {
              return '';
            }
            return `${rowValue.bestHardModeProgress}/${rowValue.maxPossibleHardmodes}`;
          }
        },
        tooltip: (rowValue) => {
          if (!rowValue.hardModes || rowValue.hardModes.length === 0) {
            return undefined;
          }
          return rowValue.hardModes.join('\n');
        }
      },
      {
        label: 'Last Updated',
        valueKey: 'lastUpdated',
        sortType: 'number',
        format: {
          // TODO: Extract a date formatter
          type: 'last-updated'
        },
        onClick: (rowValue) => this.onLastUpdatedRefreshClick(rowValue)
      }
    ];
  }
}
