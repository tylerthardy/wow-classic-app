import { ColumnSpecification, ParseColumnDeprecated } from '../common/components/grid/grid.component';
import { Theme } from '../common/services/theme/theme.type';
import { ParseUtil } from '../common/utils';
import { PlayerLookupViewModel, PlayerLookupViewModelEncounterItem } from '../player-lookup/player-lookup.viewmodel';

export class PlayerComparisonViewModelEncounter {
  constructor(
    private player1: PlayerLookupViewModelEncounterItem,
    private player2: PlayerLookupViewModelEncounterItem
  ) {}

  get encounterNameDisplay(): string | undefined {
    return this.player1.encounterNameDisplay;
  }
  get bestPercent1Display(): ParseColumnDeprecated {
    return this.player1.bestPercentDisplay;
  }
  get bestPercent2Display(): ParseColumnDeprecated {
    return this.player2.bestPercentDisplay;
  }
  get bestPercentDifference(): number {
    return this.player1.bestPercent! - this.player2.bestPercent!;
  }
}

export class PlayerComparisonViewModel {
  public encounters: PlayerComparisonViewModelEncounter[];
  public columns: ColumnSpecification<PlayerComparisonViewModelEncounter>[];

  constructor(private player1: PlayerLookupViewModel, private player2: PlayerLookupViewModel, theme: Theme) {
    if (!player1.encounters || !player2.encounters) {
      throw new Error('Encounters missing');
    }
    this.encounters = player1.encounters.map(
      (encounter, index) => new PlayerComparisonViewModelEncounter(encounter, player2.encounters![index])
    );
    this.columns = this.getColumns(theme);
  }

  private getColumns(theme: Theme): ColumnSpecification<PlayerComparisonViewModelEncounter>[] {
    return [
      {
        label: 'Boss',
        valueKey: 'encounterNameDisplay',
        sortType: 'string'
      },
      {
        label: () => this.player1.characterName,
        valueKey: 'bestPercent1Display',
        sortType: 'parse',
        format: {
          type: 'parse'
        },
        cellStyle: (rowValue) => {
          return { 'background-color': ParseUtil.getParseWarningColor(rowValue.bestPercent1Display.value, theme) };
        }
      },
      {
        label: () => this.player2.characterName,
        valueKey: 'bestPercent2Display',
        sortType: 'parse',
        format: {
          type: 'parse'
        },
        cellStyle: (rowValue) => {
          return { 'background-color': ParseUtil.getParseWarningColor(rowValue.bestPercent2Display.value, theme) };
        }
      },
      {
        label: 'Diff',
        valueKey: 'bestPercentDifference',
        sortType: 'number',
        transform: (rowValue) => {
          if (isNaN(rowValue.bestPercentDifference)) {
            return '';
          }
          if (rowValue.bestPercentDifference > 0) {
            return '+' + rowValue.bestPercentDifference;
          } else {
            return '' + rowValue.bestPercentDifference;
          }
        },
        cellStyle: (rowValue) => {
          return {
            'font-weight': 'bold',
            'background-color': ParseUtil.getDifferenceBackgroundColor(rowValue.bestPercentDifference, theme),
            color: ParseUtil.getDifferenceColor(rowValue.bestPercentDifference, theme)
          };
        }
      }
    ];
  }
}
