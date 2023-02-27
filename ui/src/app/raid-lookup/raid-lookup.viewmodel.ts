import { ColumnSpecification } from '../common/components/grid/grid.component';
import { IGetMultipleCharacterZoneRankingsResponseItem } from '../common/services/character/get-multiple-character-zone-rankings-response.interface';
import { WowClass } from '../common/specialization/wow-class';
import { ParseUtil } from '../common/utils';
import { RaidPlayerRole } from './raid-player-role.type';

export interface IRaidLookupViewModelErrorRow {
  characterName: string;
  metric: string;
  errors: string;
}

export class RaidLookupViewModel {
  public raidBestPerformanceAverage: number;
  public raidMedianPerformance: number;
  public data: IGetMultipleCharacterZoneRankingsResponseItem[];
  public columns: ColumnSpecification<IGetMultipleCharacterZoneRankingsResponseItem>[];
  public errorData: IRaidLookupViewModelErrorRow[];

  constructor(rankings: IGetMultipleCharacterZoneRankingsResponseItem[], onClick?: (name: string) => void) {
    let raidBestPerformanceTotal: number = 0;
    let raidMedianPerformances: number[] = [];

    this.columns = [
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
        onClick: onClick,
        style: {
          cursor: 'pointer'
        },
        tooltip: () => {
          if (onClick) {
            return 'Click to search player';
          } else {
            return undefined;
          }
        }
      },
      {
        label: 'Class',
        valueKey: 'classFileName',
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
          return { 'background-color': ParseUtil.getParseWarningColor(rowValue.bestPerformanceAverage) };
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
          return { 'background-color': ParseUtil.getParseWarningColor(rowValue.medianPerformanceAverage) };
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
      }
    ];

    this.data = rankings.filter((ranking) => !ranking.errors || ranking.errors.length === 0);
    this.errorData = rankings
      .filter((ranking) => ranking.errors && ranking.errors.length > 0)
      .map((ranking) => ({
        characterName: ranking.characterName,
        metric: ranking.metric,
        classFileName: ranking.classFileName,
        role: ranking.role,
        errors: JSON.stringify(ranking.errors)
      }));

    // TODO: Move this to the API
    this.data.forEach((datum) => {
      if (datum.bestPerformanceAverage) {
        raidBestPerformanceTotal += datum.bestPerformanceAverage;
      }
      if (datum.medianPerformanceAverage) {
        raidMedianPerformances.push(datum.medianPerformanceAverage);
      }
    });
    if (raidMedianPerformances.length != rankings.length) {
      for (let i = 0; i < rankings.length - raidMedianPerformances.length; i++) {
        raidMedianPerformances.push(0);
      }
    }

    this.raidBestPerformanceAverage = raidBestPerformanceTotal / rankings.length;
    this.raidMedianPerformance = Math.median(raidMedianPerformances);
  }

  public filterData(
    classFilter: WowClass | undefined,
    roleFilter: RaidPlayerRole | undefined
  ): IGetMultipleCharacterZoneRankingsResponseItem[] {
    let resultingData: IGetMultipleCharacterZoneRankingsResponseItem[] = Object.assign([], this.data);
    if (!classFilter && !roleFilter) {
      return resultingData;
    }
    if (classFilter) {
      resultingData = resultingData.filter(
        (d) => !d.classFileName || d.classFileName === classFilter.getClassFileName()
      );
    }
    if (roleFilter) {
      resultingData = resultingData.filter((d) => !d.role || d.role === roleFilter);
    }
    return resultingData;
  }
}
