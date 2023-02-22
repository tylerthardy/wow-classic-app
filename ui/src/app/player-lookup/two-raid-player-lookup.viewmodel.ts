import { ColumnSpecification, ParseColumnDeprecated } from '../common/components/grid/grid.component';
import { IGetCharacterZoneRankingsResponseRanking } from '../common/services/character/get-character-zone-rankings-response-ranking.interface';
import { IGetCharacterZoneRankingsResponse } from '../common/services/character/get-character-zone-rankings-response.interface';
import { ParseUtil } from '../common/utils';
import { PlayerLookupViewModelEncounterItem } from './player-lookup.viewmodel';

export class TwoRaidPlayerLookupViewModelEncounterItem {
  public encounterNameDisplay?: string;

  public bestPercentDisplay10?: ParseColumnDeprecated;
  public medianPercentDisplay10?: ParseColumnDeprecated;
  public highestAmount10?: number;
  public highestDifficultyDisplay10?: string;
  public kills10?: number;

  public bestPercentDisplay25?: ParseColumnDeprecated;
  public medianPercentDisplay25?: ParseColumnDeprecated;
  public highestAmount25?: number;
  public highestDifficultyDisplay25?: string;
  public kills25?: number;

  constructor(
    encounterItem10: PlayerLookupViewModelEncounterItem | undefined,
    encounterItem25: PlayerLookupViewModelEncounterItem | undefined
  ) {
    if (!encounterItem10 && !encounterItem25) {
      throw new Error('no encounter data for either raid');
    }
    if (encounterItem10) {
      this.encounterNameDisplay = encounterItem10.encounterNameDisplay;

      this.bestPercentDisplay10 = encounterItem10.bestPercentDisplay;
      this.medianPercentDisplay10 = encounterItem10.bestPercentDisplay;
      this.highestAmount10 = encounterItem10.highestAmount;
      this.highestDifficultyDisplay10 = this.extractHighestDifficultyIcon(encounterItem10.highestDifficultyDisplay);
      this.kills10 = encounterItem10.kills;
    }
    if (encounterItem25) {
      this.bestPercentDisplay25 = encounterItem25.bestPercentDisplay;
      this.medianPercentDisplay25 = encounterItem25.bestPercentDisplay;
      this.highestAmount25 = encounterItem25.highestAmount;
      this.highestDifficultyDisplay25 = this.extractHighestDifficultyIcon(encounterItem25.highestDifficultyDisplay);
      this.kills25 = encounterItem25.kills;
    }
  }

  private extractHighestDifficultyIcon(input: string): string {
    const medalIndex: number = this.getMedalIndex(input);
    if (medalIndex === -1) {
      return '';
    }
    return input.substring(medalIndex, medalIndex + 2);
  }
  private getMedalIndex(input: string): number {
    let medalIndex: number = -1;
    medalIndex = input.indexOf('🥉');
    if (medalIndex > -1) {
      return medalIndex;
    }
    medalIndex = input.indexOf('🥈');
    if (medalIndex > -1) {
      return medalIndex;
    }
    medalIndex = input.indexOf('🥇');
    return medalIndex;
  }
}

export class TwoRaidPlayerLookupViewModel {
  public characterName: string;

  public bestPerformanceAverage10?: number;
  public bestPerformanceAverage25?: number;
  public medianPerformanceAverage10?: number;
  public medianPerformanceAverage25?: number;
  public hardModes10?: string[];
  public bestHardModeProgress10?: number;
  public maxPossibleHardmodes10?: number;
  public hardModes25?: string[];
  public bestHardModeProgress25?: number;
  public maxPossibleHardmodes25?: number;

  public encounters!: TwoRaidPlayerLookupViewModelEncounterItem[];
  public columns: ColumnSpecification<TwoRaidPlayerLookupViewModelEncounterItem>[];

  constructor(
    response10: IGetCharacterZoneRankingsResponse,
    response25: IGetCharacterZoneRankingsResponse,
    columnOrder: number
  ) {
    this.characterName = response10.characterName;
    this.bestPerformanceAverage10 = response10.bestPerformanceAverage;
    this.bestPerformanceAverage25 = response25.bestPerformanceAverage;
    this.medianPerformanceAverage10 = response10.medianPerformanceAverage;
    this.medianPerformanceAverage25 = response25.medianPerformanceAverage;
    this.hardModes10 = response10.hardModes;
    this.hardModes25 = response25.hardModes;
    this.bestHardModeProgress10 = response10.bestHardModeProgress;
    this.bestHardModeProgress25 = response25.bestHardModeProgress;
    this.maxPossibleHardmodes10 = response10.maxPossibleHardmodes;
    this.maxPossibleHardmodes25 = response25.maxPossibleHardmodes;
    if (columnOrder === 1) {
      this.columns = this.getSeparatedColumnOrder();
    } else {
      this.columns = this.getPairedColumnOrder();
    }

    if (!response10.encounters || !response25.encounters) {
      throw new Error('both raids must have encounters');
    }
    if (response10.encounters.length !== response25.encounters.length) {
      throw new Error('encounters lengths dont match');
    }
    if (!response10.warcraftLogsClassId) {
      throw new Error('no class id on response');
    }

    const wclClassId: number = response10.warcraftLogsClassId;
    if (response10.encounters && response25.encounters) {
      this.encounters = response10.encounters.map((encounter10, i) => {
        const encounter25: IGetCharacterZoneRankingsResponseRanking = response25.encounters![i];
        return new TwoRaidPlayerLookupViewModelEncounterItem(
          new PlayerLookupViewModelEncounterItem(wclClassId, encounter10),
          new PlayerLookupViewModelEncounterItem(wclClassId, encounter25)
        );
      });
    }
    if (!response10.encounters && response25.encounters) {
      this.encounters = response25.encounters.map((encounter25, i) => {
        return new TwoRaidPlayerLookupViewModelEncounterItem(
          undefined,
          new PlayerLookupViewModelEncounterItem(wclClassId, encounter25)
        );
      });
    }
    if (response10.encounters && !response25.encounters) {
      this.encounters = response10.encounters.map((encounter10, i) => {
        return new TwoRaidPlayerLookupViewModelEncounterItem(
          new PlayerLookupViewModelEncounterItem(wclClassId, encounter10),
          undefined
        );
      });
    }
  }
  getPairedColumnOrder(): ColumnSpecification<TwoRaidPlayerLookupViewModelEncounterItem>[] {
    return [
      {
        label: 'Boss',
        valueKey: 'encounterNameDisplay',
        sortType: 'string'
      },
      {
        label: 'Best10',
        valueKey: 'bestPercentDisplay10',
        sortType: 'parse',
        format: {
          type: 'parse'
        },
        style: (rowValue) => {
          return { 'background-color': ParseUtil.getParseWarningColor(rowValue.bestPercentDisplay10?.value) };
        }
      },
      {
        label: 'Best25',
        valueKey: 'bestPercentDisplay25',
        sortType: 'parse',
        format: {
          type: 'parse'
        },
        style: (rowValue) => {
          return { 'background-color': ParseUtil.getParseWarningColor(rowValue.bestPercentDisplay25?.value) };
        }
      },
      {
        label: 'Med10',
        valueKey: 'medianPercentDisplay10',
        sortType: 'parse',
        format: {
          type: 'parse'
        },
        style: (rowValue) => {
          return { 'background-color': ParseUtil.getParseWarningColor(rowValue.medianPercentDisplay10?.value) };
        }
      },
      {
        label: 'Med25',
        valueKey: 'medianPercentDisplay25',
        sortType: 'parse',
        format: {
          type: 'parse'
        },
        style: (rowValue) => {
          return { 'background-color': ParseUtil.getParseWarningColor(rowValue.medianPercentDisplay25?.value) };
        }
      },
      {
        label: 'Highest10',
        valueKey: 'highestAmount10',
        sortType: 'number',
        format: {
          type: 'number',
          formatParams: '1.1-1'
        }
      },
      {
        label: 'Highest25',
        valueKey: 'highestAmount25',
        sortType: 'number',
        format: {
          type: 'number',
          formatParams: '1.1-1'
        }
      },
      {
        label: 'HM10',
        valueKey: 'highestDifficultyDisplay10',
        sortType: 'string'
      },
      {
        label: 'HM25',
        valueKey: 'highestDifficultyDisplay25',
        sortType: 'string'
      },
      {
        label: 'KC10',
        valueKey: 'kills10',
        sortType: 'number',
        format: { type: 'number' }
      },
      {
        label: 'KC25',
        valueKey: 'kills25',
        sortType: 'number',
        format: { type: 'number' }
      }
    ];
  }
  getSeparatedColumnOrder(): ColumnSpecification<TwoRaidPlayerLookupViewModelEncounterItem>[] {
    return [
      {
        label: 'Boss',
        valueKey: 'encounterNameDisplay',
        sortType: 'string'
      },
      {
        label: 'Best',
        valueKey: 'bestPercentDisplay10',
        sortType: 'parse',
        format: {
          type: 'parse'
        },
        style: (rowValue) => {
          return { 'background-color': ParseUtil.getParseWarningColor(rowValue.bestPercentDisplay10?.value) };
        }
      },
      {
        label: 'Med',
        valueKey: 'medianPercentDisplay10',
        sortType: 'parse',
        format: {
          type: 'parse'
        },
        style: (rowValue) => {
          return { 'background-color': ParseUtil.getParseWarningColor(rowValue.medianPercentDisplay10?.value) };
        }
      },
      {
        label: 'Highest',
        valueKey: 'highestAmount10',
        sortType: 'number',
        format: {
          type: 'number',
          formatParams: '1.1-1'
        }
      },
      {
        label: 'HM',
        valueKey: 'highestDifficultyDisplay10',
        sortType: 'string'
      },
      {
        label: 'KC',
        valueKey: 'kills10',
        sortType: 'number',
        format: { type: 'number' }
      },
      {
        label: 'Best',
        valueKey: 'bestPercentDisplay25',
        sortType: 'parse',
        format: {
          type: 'parse'
        },
        style: (rowValue) => {
          return { 'background-color': ParseUtil.getParseWarningColor(rowValue.bestPercentDisplay25?.value) };
        }
      },
      {
        label: 'Med',
        valueKey: 'medianPercentDisplay25',
        sortType: 'parse',
        format: {
          type: 'parse'
        },
        style: (rowValue) => {
          return { 'background-color': ParseUtil.getParseWarningColor(rowValue.medianPercentDisplay25?.value) };
        }
      },
      {
        label: 'Highest',
        valueKey: 'highestAmount25',
        sortType: 'number',
        format: {
          type: 'number',
          formatParams: '1.1-1'
        }
      },
      {
        label: 'HM',
        valueKey: 'highestDifficultyDisplay25',
        sortType: 'string'
      },
      {
        label: 'Kills',
        valueKey: 'kills25',
        sortType: 'number',
        format: { type: 'number' }
      }
    ];
  }
}
