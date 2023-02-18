import { IGetMultipleCharacterZoneRankingsResponseItem } from '../../../../models/api';
import { ColumnSpecification } from '../common/components/grid/grid.component';
import { ParseUtil } from '../common/utils';
import { RaidPlayer } from './raid-player.interface';

export class RaidLookupViewModel {
  public raidBestPerformanceAverage: number;
  public raidMedianPerformance: number;
  public data: IGetMultipleCharacterZoneRankingsResponseItem[];
  public columns: ColumnSpecification<IGetMultipleCharacterZoneRankingsResponseItem>[];

  constructor(
    rankings: IGetMultipleCharacterZoneRankingsResponseItem[],
    players: RaidPlayer[],
    onClick?: (name: string) => void
  ) {
    let raidBestPerformanceTotal: number = 0;
    let raidMedianPerformances: number[] = [];

    this.columns = [
      {
        label: 'Player',
        valueKey: 'characterName',
        sortType: 'string',
        onClick: onClick,
        style: {
          cursor: 'pointer'
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

    this.data = rankings;

    this.data.forEach((datum) => {
      if (datum.bestPerformanceAverage) {
        raidBestPerformanceTotal += datum.bestPerformanceAverage;
      }
      if (datum.medianPerformanceAverage) {
        raidMedianPerformances.push(datum.medianPerformanceAverage);
      } else {
        raidMedianPerformances.push(0);
      }
    });

    this.raidBestPerformanceAverage = raidBestPerformanceTotal / rankings.length;
    this.raidMedianPerformance = Math.median(raidMedianPerformances);
  }
}
