import { IGetCharacterZoneRankingsResponse, RankingMetric } from 'classic-companion-core';
import { ColumnSpecification } from '../../common/components/grid/grid.component';
import { Theme } from '../../common/services/theme/theme.type';
import { ParseUtil } from '../../common/utils';
import { PlayerLookupViewModelEncounterItem } from '../../player-lookup/player-lookup.viewmodel';

class ViewModelCharacter {
  public name: string;
  public metric: RankingMetric;
  public encounterById: { [key: number]: PlayerLookupViewModelEncounterItem } = {};
  public bestPerformanceAverage?: number;
  public bestHardModeProgress?: number;
  public maxPossibleHardmodes?: number;
  public hardModes?: string[];

  constructor(ranking: IGetCharacterZoneRankingsResponse) {
    this.name = ranking.characterName;
    this.metric = ranking.metric;
    if (ranking.encounters) {
      this.bestPerformanceAverage = ranking.bestPerformanceAverage;
      this.bestHardModeProgress = ranking.bestHardModeProgress;
      this.maxPossibleHardmodes = ranking.maxPossibleHardmodes;
      this.hardModes = ranking.hardModes;

      ranking.encounters.forEach(
        (encounter) =>
          (this.encounterById[encounter.encounterId] = new PlayerLookupViewModelEncounterItem(
            ranking.warcraftLogsClassId,
            encounter,
            'light'
          ))
      );
    }
  }
}

export class MyCharactersRankingsViewModel {
  public characters: ViewModelCharacter[] = [];
  public columns: ColumnSpecification<ViewModelCharacter>[] = [];

  constructor(charactersRankings: IGetCharacterZoneRankingsResponse[], theme: Theme) {
    this.characters = charactersRankings.map((ranking) => new ViewModelCharacter(ranking));
    this.columns = [
      {
        label: 'Character',
        valueKey: 'name',
        sortType: 'string'
      },
      {
        label: 'Type',
        valueKey: 'metric',
        sortType: 'string'
      },
      {
        label: 'Avg %',
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
        label: 'HMs',
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
      ...this.getEncounterColumns(charactersRankings, theme)
    ];
  }

  private getEncounterColumns(
    charactersRankings: IGetCharacterZoneRankingsResponse[],
    theme: Theme
  ): ColumnSpecification<ViewModelCharacter>[] {
    const characterWithEncounters: IGetCharacterZoneRankingsResponse | undefined = charactersRankings.find(
      (rankings) => rankings.encounters && rankings.encounters.length > 0
    );
    if (!characterWithEncounters || !characterWithEncounters.encounters) {
      throw new Error('Could not find character with rankings');
    }
    return characterWithEncounters.encounters.map((encounter) => ({
      label: encounter.encounterName,
      valueKey: 'name', // Hack; Using name because we transform & custom sort from another the actual encounters
      transform: (characterRowValue: ViewModelCharacter) => {
        return characterRowValue.encounterById[encounter.encounterId]?.bestPercentDisplay;
      },
      format: {
        type: 'parse'
      },
      sortType: 'custom',
      customSort: (a: ViewModelCharacter, b: ViewModelCharacter) =>
        a.encounterById[encounter.encounterId].bestPercent! - b.encounterById[encounter.encounterId].bestPercent!,
      cellStyle: (rowValue) => {
        return { 'background-color': ParseUtil.getParseWarningColor(rowValue.bestPerformanceAverage, theme) };
      }
    }));
  }
}
