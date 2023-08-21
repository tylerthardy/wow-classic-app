import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import {
  IGetCharacterZoneRankingsResponse,
  IGetMultipleCharacterZoneRankingsResponse,
  Instances,
  Raid,
  SpecializationData,
  WowClass
} from 'classic-companion-core';
import { finalize } from 'rxjs';
import { ColumnSpecification } from '../common/components/grid/grid.component';
import { InstanceSizeSelection } from '../common/components/instance-size-selection/instance-size-selection';
import { CharacterService } from '../common/services/character/character.service';
import { IGetCharacterZoneRankings } from '../common/services/character/get-character-zone-rankings.interface';
import { ThemeService } from '../common/services/theme/theme.service';
import { Theme } from '../common/services/theme/theme.type';
import { ToastService } from '../common/services/toast/toast.service';
import { ParseUtil } from '../common/utils';
import { AppConfig } from '../config/app.config';
import { RaidPlayerRole } from '../raid-lookup/raid-player-role.type';
import { AddonImport } from './addon-import.interface';
import { RaidLookupCharacter } from './raid-lookup-character';

const sample: AddonImport = {
  version: '0.1',
  group: [
    {
      class: 'PALADIN',
      name: 'Pertadin',
      roles: [0, 1, 0]
    }
  ]
};

@Component({
  selector: 'app-raid-lookup',
  templateUrl: './raid-lookup.component.html',
  styleUrls: ['./raid-lookup.component.scss']
})
export class RaidLookupComponent implements OnInit {
  @ViewChild('testTemplate', { static: true }) testTemplateRef!: TemplateRef<any>;
  @ViewChild('wclLinkTemplate', { static: true }) wclLinkTemplateRef!: TemplateRef<any>;
  @ViewChild('classSpecTemplate', { static: true }) classSpecTemplateRef!: TemplateRef<any>;
  @Output() public characterNameClicked: EventEmitter<string> = new EventEmitter<string>();
  @Input() public instanceSizeSelection: InstanceSizeSelection = new InstanceSizeSelection({
    instance: Instances.ToGC,
    sizes: [10]
  });
  protected importJson: string | undefined = JSON.stringify(sample);
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
    private toastService: ToastService,
    private themeService: ThemeService,
    private config: AppConfig
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

  protected onSpecializationChange(
    specialization: SpecializationData | undefined,
    character: RaidLookupCharacter
  ): void {
    character.selectedSpec = specialization;
    this.refreshCharacter(character);
  }

  public searchRaid(json: string): void {
    let addonImport: AddonImport;
    try {
      addonImport = JSON.parse(json);
    } catch (err) {
      this.toastService.warn(
        'Invalid Data',
        'The data on clipboard is not valid json. Copy from the addon and try again.'
      );
      return;
    }

    if (addonImport.version !== this.config.addonVersion) {
      this.toastService.warn(
        'Outdated Addon',
        'Get the latest version of the addon from the "Download Addon" button at the top of the page.'
      );
      return;
    }

    this.importJson = json;

    if (!this.instanceSizeSelection.hasSize()) {
      this.toastService.warn('Invalid Search', 'Select a raid instance and size');
      return;
    }

    let raid: Raid;
    try {
      raid = this.instanceSizeSelection.getRaid();
    } catch (err) {
      this.toastService.error('Error', 'No raids found for provided data' + JSON.stringify(this.instanceSizeSelection));
      return;
    }

    this.clearCharacterData();

    let queries: IGetCharacterZoneRankings[] = [];
    for (let importedCharacter of addonImport.group) {
      const raidCharacter: RaidLookupCharacter = new RaidLookupCharacter(importedCharacter, raid);
      this.characters.push(raidCharacter);

      const query: IGetCharacterZoneRankings = {
        characterName: raidCharacter.name,
        metric: raidCharacter.metric,
        classSlug: raidCharacter.class?.slug,
        role: raidCharacter.role,
        zoneId: this.instanceSizeSelection.instance.zoneId,
        size: this.instanceSizeSelection.getSize(),
        specName: raidCharacter.selectedSpec?.name
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
      resultingData = resultingData.filter((d) => !d.class || d.class.id === classFilter.id);
    }
    if (roleFilter) {
      resultingData = resultingData.filter((d) => !d.role || d.role === roleFilter);
    }
    return resultingData.filter((d) => !d.errors || d.errors.length === 0);
  }

  private getErroredData(): RaidLookupCharacter[] {
    return this.characters.filter((d) => d.errors && d.errors.length > 0);
  }

  private refreshCharacter(character: RaidLookupCharacter): void {
    character.lastUpdatedChanging = true;
    const query: IGetCharacterZoneRankings = {
      characterName: character.characterName,
      zoneId: character.raid.instance.zoneId,
      metric: character.metric,
      size: character.raid.size,
      specName: character.selectedSpec?.name
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
        label: 'WCL',
        valueKey: 'characterName',
        sortType: 'string',
        format: {
          type: 'template',
          template: this.wclLinkTemplateRef
        }
      },
      {
        label: 'Player',
        valueKey: 'characterName',
        sortType: 'string',
        cellStyle: {
          cursor: 'pointer'
        },
        onClick: (value: string) => this.onCharacterNameClick(value)
      },
      {
        label: 'Class',
        valueKey: 'class',
        sortType: 'class',
        columnStyle: {
          width: '62px'
        },
        format: {
          type: 'template',
          template: this.classSpecTemplateRef
        }
      },
      {
        label: 'Role',
        valueKey: 'role',
        sortType: 'role',
        format: {
          type: 'role',
          formatParams: {
            showName: false
          }
        }
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
        cellStyle: (rowValue) => {
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
        cellStyle: (rowValue) => {
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
        onClick: (rowValue) => this.refreshCharacter(rowValue)
      },
      {
        label: 'template test',
        valueKey: 'lastUpdated',
        sortType: 'number',
        format: {
          type: 'template',
          template: this.testTemplateRef
        }
      }
    ];
  }
}
