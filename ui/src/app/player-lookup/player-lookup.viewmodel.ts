import { IGetCharacterZoneRankingsResponseRanking } from '../../../../models';
import { ColumnSpecification, ParseColumnDeprecated } from '../common/components/grid/grid.component';
import { IGetCharacterZoneRankingsResponse } from '../common/services/character/get-character-zone-rankings-response.interface';
import { Theme } from '../common/services/theme/theme.type';
import { SpecializationData } from '../common/specialization/specialization-data.interface';
import { specializations } from '../common/specialization/specializations';
import { WowClass } from '../common/specialization/wow-class';
import { ParseUtil } from '../common/utils';

export class PlayerLookupViewModelEncounterItem implements IGetCharacterZoneRankingsResponseRanking {
  public encounterName: string;
  public lockedIn: boolean;
  public bestPercent?: number;
  public bestSpec?: string;
  public medianPercent?: number;
  public highestAmount?: number;
  public kills?: number;
  public fastest?: number;
  public highestDifficulty?: string;
  public encounterNameDisplay: string;
  public bestPercentDisplay: ParseColumnDeprecated;
  public medianPercentDisplay: ParseColumnDeprecated;
  public highestDifficultyDisplay: string;
  public rowStyle?: { [key: string]: any };

  constructor(
    warcraftLogsClassId: number | undefined,
    encounter: IGetCharacterZoneRankingsResponseRanking,
    theme: Theme
  ) {
    this.encounterName = encounter.encounterName;
    this.lockedIn = encounter.lockedIn;
    this.bestPercent = encounter.bestPercent;
    this.bestSpec = encounter.bestSpec;
    this.medianPercent = encounter.medianPercent;
    this.highestAmount = encounter.highestAmount;
    this.kills = encounter.kills;
    this.fastest = encounter.fastest;
    this.highestDifficulty = encounter.highestDifficulty;
    this.encounterNameDisplay = this.getEncounterNameDisplay(encounter);
    this.bestPercentDisplay = {
      value: encounter.bestPercent,
      specialization: this.getSpecialization(warcraftLogsClassId, encounter.bestSpec)
    };
    this.medianPercentDisplay = {
      value: encounter.medianPercent
    };
    (this.highestDifficultyDisplay = this.getHighestDifficultyDisplay(encounter.highestDifficulty)),
      (this.rowStyle = !encounter.lockedIn
        ? {
            'font-weight': 'bold',
            color: ParseUtil.getNotLockedInColor(),
            'background-color': ParseUtil.getNotLockedInBackgroundColor()
          }
        : {});
  }

  private getEncounterNameDisplay(encounter: IGetCharacterZoneRankingsResponseRanking) {
    const name: string = encounter.encounterName;
    const modifiers: string[] = [];
    if (!encounter.lockedIn) {
      modifiers.push('🚀');
    }
    if (modifiers.length === 0) {
      return name;
    }
    return name + ' ' + modifiers.join();
  }

  private getHighestDifficultyDisplay(highestDifficulty?: string) {
    if (!highestDifficulty) return '';
    return this.getDifficultyMedal(highestDifficulty) + ' ' + highestDifficulty;
  }

  // FIXME: Should this be in the API???
  private getDifficultyMedal(difficultyName?: string): string {
    if (!difficultyName) {
      return '';
    }
    switch (difficultyName) {
      case 'Hard Mode':
      case '0 Lights':
      case 'Steelbreaker':
      case '3 Elders':
        return '🥇';
      case '1 Light':
      case '2 Lights':
      case '3 Lights':
      case 'Runemaster':
      case '2 Elders':
      case '1 Elders':
        return '🥈';
      case 'Normal Mode':
      case '4 Lights':
      case 'Stormcaller':
      case '0 Elders':
        return '🥉';
    }
    return '';
  }

  // FIXME: Should be in the API
  private getSpecialization(
    warcraftLogsClassId: number | undefined,
    specName: string | undefined
  ): SpecializationData | undefined {
    if (!specName || !warcraftLogsClassId) {
      return undefined;
    }

    const wowClass: WowClass | undefined = WowClass.getClassByWarcraftLogsId(warcraftLogsClassId);
    if (!wowClass) {
      return undefined;
    }

    const specialization: SpecializationData | undefined = specializations.find((spec) => {
      const normalizedEnumName: string = spec.specializationName.replace(' ', '').toLowerCase();
      const normalizedDataName: string = specName.toLowerCase();
      return spec.className === wowClass.name && normalizedEnumName === normalizedDataName;
    });
    if (!specialization) {
      throw new Error(`specialization ${specName} not found for class id ${wowClass.id}`);
    }

    return specialization;
  }
}

export class PlayerLookupViewModel {
  public characterName: string;
  public warcraftLogsClassId?: number;
  public bestPerformanceAverage?: number;
  public medianPerformanceAverage?: number;
  public hardModes?: string[];
  public bestHardModeProgress?: number;
  public maxPossibleHardmodes?: number;

  public encounters?: PlayerLookupViewModelEncounterItem[];
  public columns: ColumnSpecification<PlayerLookupViewModelEncounterItem>[];

  constructor(characterData: IGetCharacterZoneRankingsResponse, theme: Theme) {
    this.characterName = characterData.characterName;
    this.warcraftLogsClassId = characterData.warcraftLogsClassId;
    this.bestPerformanceAverage = characterData.bestPerformanceAverage;
    this.medianPerformanceAverage = characterData.medianPerformanceAverage;
    this.hardModes = characterData.hardModes;
    this.bestHardModeProgress = characterData.bestHardModeProgress;
    this.maxPossibleHardmodes = characterData.maxPossibleHardmodes;
    this.columns = this.getPlayerColumns(theme);

    this.encounters = characterData.encounters?.map(
      (encounter: IGetCharacterZoneRankingsResponseRanking): PlayerLookupViewModelEncounterItem =>
        new PlayerLookupViewModelEncounterItem(characterData.warcraftLogsClassId, encounter, theme)
    );
  }

  private getPlayerColumns(theme: Theme): ColumnSpecification<PlayerLookupViewModelEncounterItem>[] {
    return [
      {
        label: 'Boss',
        valueKey: 'encounterNameDisplay',
        sortType: 'string'
      },
      {
        label: 'Best %',
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
        label: 'Highest DPS',
        valueKey: 'highestAmount',
        sortType: 'number',
        format: {
          type: 'number',
          formatParams: '1.1-1'
        }
      },
      {
        label: 'Difficulty',
        valueKey: 'highestDifficultyDisplay',
        sortType: 'string'
      },
      {
        label: 'Kills',
        valueKey: 'kills',
        sortType: 'number',
        format: { type: 'number' }
      },
      {
        label: 'Fastest',
        valueKey: 'fastest',
        sortType: 'number',
        format: {
          type: 'date',
          formatParams: 'm:ss'
        }
      }
    ];
  }
}
