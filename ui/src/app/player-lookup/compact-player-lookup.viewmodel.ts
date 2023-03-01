import { DatePipe } from '@angular/common';
import { ColumnSpecification } from '../common/components/grid/grid.component';
import { IGetCharacterZoneRankingsResponse } from '../common/services/character/get-character-zone-rankings-response.interface';
import { Theme } from '../common/services/theme/theme.type';
import { ParseUtil } from '../common/utils';
import { PlayerLookupViewModel, PlayerLookupViewModelEncounterItem } from './player-lookup.viewmodel';

export class CompactPlayerLookupViewModel extends PlayerLookupViewModel {
  constructor(characterData: IGetCharacterZoneRankingsResponse, theme: Theme) {
    super(characterData, theme);
    this.columns = this.getCompactColumns(theme);
  }

  private getCompactColumns(theme: Theme): ColumnSpecification<PlayerLookupViewModelEncounterItem>[] {
    return [
      {
        label: 'Boss',
        valueKey: 'encounterNameDisplay',
        sortType: 'string'
      },
      {
        label: 'Best',
        valueKey: 'bestPercentDisplay',
        sortType: 'parse',
        format: {
          type: 'parse'
        },
        style: (rowValue) => {
          return { 'background-color': ParseUtil.getParseWarningColor(rowValue.bestPercentDisplay.value, theme) };
        }
      },
      {
        label: 'Med',
        valueKey: 'medianPercentDisplay',
        sortType: 'parse',
        format: {
          type: 'parse'
        },
        style: (rowValue) => {
          return { 'background-color': ParseUtil.getParseWarningColor(rowValue.medianPercentDisplay.value, theme) };
        }
      },
      {
        label: 'Highest',
        valueKey: 'highestAmount',
        sortType: 'number',
        format: {
          type: 'number',
          formatParams: '1.1-1'
        },
        tooltip: (rowValue) => {
          if (!rowValue.fastest) {
            return undefined;
          }
          const datePipe: DatePipe = new DatePipe('en-US');
          const transformed: string | null = datePipe.transform(rowValue.fastest, 'm:ss');
          if (transformed === null) {
            return undefined;
          }
          return transformed;
        }
      },
      {
        label: 'HM',
        valueKey: 'highestDifficultyDisplay',
        sortType: 'string',
        transform: (rowValue) => {
          return this.extractHighestDifficultyIcon(rowValue.highestDifficultyDisplay);
        }
      },
      {
        label: 'KC',
        valueKey: 'kills',
        sortType: 'number',
        format: { type: 'number' }
      }
    ];
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
