import {
  IGetCharacterZoneRankingsResponse,
  IGetMultipleCharacterZoneRankingsResponseItem,
  Raid,
  RankingMetric,
  WowClass
} from 'classic-companion-core';
import { RaidPlayerRole } from '../raid-lookup/raid-player-role.type';
import { JsonRaidPlayer } from '../raid-lookup/raid-player.interface';

const playerRoleLookup: RaidPlayerRole[] = ['TANK', 'HEALER', 'DAMAGER'];

export class RaidLookupCharacter {
  public name: string;
  public role: RaidPlayerRole;
  public class?: WowClass;
  public metric: RankingMetric;
  public characterName: string;
  public lastUpdated?: number | undefined;
  public warcraftLogsClassId?: number | undefined;
  public bestPerformanceAverage?: number | undefined;
  public medianPerformanceAverage?: number | undefined;
  public bestProgress?: number | undefined;
  public maxPossibleProgress?: number | undefined;
  public bestHardModeProgress?: number | undefined;
  public hardModes?: string[] | undefined;
  public maxPossibleHardmodes?: number | undefined;
  public errors?: any[] | undefined;
  public raid: Raid;

  public lastUpdatedChanging: boolean = false;

  constructor(player: JsonRaidPlayer, raid: Raid) {
    this.name = player.name;
    this.raid = raid;
    this.characterName = player.name; // FIXME: Shouldn't be duplicated
    this.class = WowClass.getClassByName(player.class);
    this.role = this.getFirstRoleFromArray(player.roles);
    this.metric = this.getMetricFromRole(this.role);
  }

  private getFirstRoleFromArray(roles: [number, number, number]): RaidPlayerRole {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i] === 1) {
        return playerRoleLookup[i];
      }
    }
    return 'DAMAGER';
  }

  public updateRankingData(data: IGetMultipleCharacterZoneRankingsResponseItem): void {
    this.lastUpdated = data.lastUpdated;
    this.warcraftLogsClassId = data.warcraftLogsClassId;
    this.bestPerformanceAverage = data.bestPerformanceAverage;
    this.medianPerformanceAverage = data.medianPerformanceAverage;
    this.bestProgress = data.bestProgress;
    this.maxPossibleProgress = data.maxPossibleProgress;
    this.bestHardModeProgress = data.bestHardModeProgress;
    this.hardModes = data.hardModes;
    this.maxPossibleHardmodes = data.maxPossibleHardmodes;
    this.errors = data.errors;
  }

  public updateSingleRankingData(data: IGetCharacterZoneRankingsResponse): void {
    this.lastUpdated = data.lastUpdated;
    this.warcraftLogsClassId = data.warcraftLogsClassId;
    this.bestPerformanceAverage = data.bestPerformanceAverage;
    this.medianPerformanceAverage = data.medianPerformanceAverage;

    // FIXME: API responsibility
    this.bestProgress = data.encounters?.filter((encounter) => encounter.kills && encounter.kills > 0).length;
    this.maxPossibleProgress = data.encounters?.length;

    this.hardModes = data.hardModes;
    this.bestHardModeProgress = data.bestHardModeProgress;
    this.maxPossibleHardmodes = data.maxPossibleHardmodes;
    this.errors = [];
  }

  public getErrorsString(): string {
    return JSON.stringify(this.errors);
  }

  // TODO: Move this out to an enum
  private getMetricFromRole(role: RaidPlayerRole): RankingMetric {
    switch (role) {
      case 'DAMAGER':
      case 'TANK':
        return 'dps';
      case 'HEALER':
        return 'hps';
    }
  }
}
