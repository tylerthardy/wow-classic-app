import { IGetCharacterZoneRankingsResponse, IGetCharacterZoneRankingsResponseRanking } from '../../../../models/api';
import { ColumnSpecification, ParseColumnDeprecated } from '../common/components/grid/grid.component';
import { SpecializationData } from '../common/specialization/specialization-data.interface';
import { specializations } from '../common/specialization/specializations';
import { WowClass } from '../common/specialization/wow-class';
import { ParseUtil } from '../common/utils';

export interface PlayerLookupViewModelEncounterItem extends IGetCharacterZoneRankingsResponseRanking {
  encounterNameDisplay: string;
  bestPercentDisplay: ParseColumnDeprecated;
  medianPercentDisplay: ParseColumnDeprecated;
  rowStyle?: { [key: string]: any };
}

export class PlayerLookupViewModel {
  public characterName: string;
  public bestPerformanceAverage?: number;
  public medianPerformanceAverage?: number;

  public encounters?: PlayerLookupViewModelEncounterItem[];
  public columns: ColumnSpecification<PlayerLookupViewModelEncounterItem>[] = [
    {
      label: 'Boss',
      valueKey: 'encounterName',
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
        return { 'background-color': ParseUtil.getParseWarningColor(rowValue.bestPercentDisplay.value) };
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
        return { 'background-color': ParseUtil.getParseWarningColor(rowValue.medianPercentDisplay.value) };
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
      valueKey: 'highestDifficulty',
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

  constructor(characterData: IGetCharacterZoneRankingsResponse) {
    this.characterName = characterData.characterName;
    this.bestPerformanceAverage = characterData.bestPerformanceAverage;
    this.medianPerformanceAverage = characterData.medianPerformanceAverage;

    this.encounters = characterData.encounters?.map((encounter): PlayerLookupViewModelEncounterItem => {
      return {
        ...encounter,
        encounterNameDisplay: encounter.encounterName + (!encounter.lockedIn ? ' 🚀' : ''),
        bestPercentDisplay: {
          value: encounter.bestPercent,
          specialization: this.getSpecialization(characterData.warcraftLogsClassId, encounter.bestSpec)
        },
        medianPercentDisplay: {
          value: encounter.medianPercent
        },
        rowStyle: !encounter.lockedIn
          ? {
              'font-weight': 'bold',
              color: '#004000',
              'background-color': '#dcf4d9'
            }
          : {}
      };
    });
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

    const specialization: SpecializationData | undefined = specializations.find(
      (spec) => spec.className === wowClass.name && spec.specializationName === specName
    );
    if (!specialization) {
      throw new Error(`specialization ${specName} not found for class id ${wowClass.id}`);
    }

    return specialization;
  }
}
