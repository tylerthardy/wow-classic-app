import { ColumnSpecification, ParseColumn } from '../common/components/grid/grid.component';
import { CharacterZoneRankings, ZoneEncounterRanking } from '../common/services/graphql';
import { WowClass } from '../common/specialization/wow-class';
import { ParseUtil } from '../common/utils';
import { RaidPlayerRole } from './raid-player-role.type';
import { RaidPlayer } from './raid-player.interface';

export interface RaidLookupViewModelCharacterRanking {
  characterName: string;
  role: RaidPlayerRole;
  wowClass: WowClass;
  bestPerformanceAverage: ParseColumn;
  medianPerformanceAverage: ParseColumn;
  bestProgress: number;
  maxPossibleProgress: number;
  bestHardModeProgress: number;
  hardModes: string[];
}

export class RaidLookupViewModel {
  public raidBestPerformanceAverage: number;
  public raidMedianPerformance: number;
  public data: RaidLookupViewModelCharacterRanking[];
  public columns: ColumnSpecification<RaidLookupViewModelCharacterRanking>[];

  constructor(rankings: CharacterZoneRankings[], players: RaidPlayer[], onClick?: (name: string) => void) {
    let raidBestPerformanceTotal: number = 0;
    let raidMedianPerformances: number[] = [];
    const zoneId: number = rankings[0].zoneRankings.zone;

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
        label: 'Role',
        valueKey: 'role',
        sortType: 'string'
      },
      {
        label: 'Best Perf. Avg',
        valueKey: 'bestPerformanceAverage',
        sortType: 'parse',
        format: {
          type: 'parse'
        },
        style: (rowValue) => {
          return { 'background-color': ParseUtil.getParseWarningColor(rowValue.bestPerformanceAverage.value) };
        }
      },
      {
        label: 'Med Perf. Avg',
        valueKey: 'medianPerformanceAverage',
        sortType: 'parse',
        format: {
          type: 'parse'
        },
        style: (rowValue) => {
          return { 'background-color': ParseUtil.getParseWarningColor(rowValue.medianPerformanceAverage.value) };
        }
      },
      {
        label: 'Best Progress',
        valueKey: 'bestProgress',
        sortType: 'number',
        format: {
          type: 'custom',
          customFormat: (rowValue) => {
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
            return `${rowValue.bestHardModeProgress}/${this.getHardModeCount(zoneId)}`;
          }
        },
        tooltip: (rowValue) => rowValue.hardModes.join('\n')
      }
    ];

    const playerRoleNameLookup: { [key: string]: RaidPlayerRole } = this.getPlayerRoleNameLookup(players);

    //TODO: This is the same as a single character mapping viewmodel
    this.data = rankings.map((rankingData) => {
      // Class
      const wowClass: WowClass | undefined = WowClass.getClassByWarcraftLogsId(rankingData.classID);
      if (!wowClass) {
        throw new Error('class cannot be found for id ' + rankingData.classID);
      }
      const FLAME_LEVIATHAN_ENCOUNTER_ID: number = 744;
      const encounterRankings: ZoneEncounterRanking[] = rankingData.zoneRankings.rankings.filter(
        (encounterRanking) => encounterRanking.encounter.id !== FLAME_LEVIATHAN_ENCOUNTER_ID
      );
      const hardModes: string[] = this.getHardModes(encounterRankings);
      const datum: RaidLookupViewModelCharacterRanking = {
        characterName: rankingData.name,
        role: playerRoleNameLookup[rankingData.name] ?? 'player not found',
        bestPerformanceAverage: {
          value: rankingData.zoneRankings.bestPerformanceAverage
        },
        medianPerformanceAverage: {
          value: rankingData.zoneRankings.medianPerformanceAverage
        },
        wowClass: wowClass,
        bestProgress: this.getBestProgress(encounterRankings),
        maxPossibleProgress: encounterRankings.length,
        bestHardModeProgress: hardModes.length,
        hardModes: hardModes
      };
      raidBestPerformanceTotal += datum.bestPerformanceAverage.value; //TODO: This is the only difference
      raidMedianPerformances.push(datum.medianPerformanceAverage.value);
      return datum;
    });

    this.raidBestPerformanceAverage = raidBestPerformanceTotal / rankings.length;
    this.raidMedianPerformance = Math.median(raidMedianPerformances);
  }

  private getPlayerRoleNameLookup(players: RaidPlayer[]): {
    [key: string]: RaidPlayerRole;
  } {
    const lookup: { [key: string]: RaidPlayerRole } = {};
    players.forEach((player) => (lookup[player.name] = player.role));
    return lookup;
  }

  // FIXME: Duplicated in multiple view models
  private getBestProgress(encounterRankings: ZoneEncounterRanking[]): number {
    const killCount: number = encounterRankings.filter((ranking) => ranking.totalKills > 0).length;
    return killCount;
  }

  private getHardModes(encounterRankings: ZoneEncounterRanking[]): string[] {
    return encounterRankings
      .filter((ranking) => ranking.totalKills > 0 && ranking.bestAmount > 20000000)
      .map((ranking) => ranking.encounter.name);
  }

  private getHardModeCount(zoneId: number): number {
    if (zoneId === 1017) {
      // FIXME: Zone ids enum
      return 13 - 5;
    }
    if (zoneId === 1015) {
      return 1; // Sartharion
    }
    return 0;
  }
}
