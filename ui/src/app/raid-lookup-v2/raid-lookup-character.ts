import { IGetCharacterZoneRankingsResponse } from '../common/services/character/get-character-zone-rankings-response.interface';
import { IGetMultipleCharacterZoneRankingsResponseItem } from '../common/services/character/get-multiple-character-zone-rankings-response.interface';
import { RankingMetric } from '../common/services/graphql';
import { RaidZoneAndSize } from '../common/services/raids/raid-zone-and-size.interface';
import { RaidPlayerRole } from '../raid-lookup/raid-player-role.type';
import { JsonRaidPlayer } from '../raid-lookup/raid-player.interface';

export class RaidLookupCharacter implements JsonRaidPlayer, IGetMultipleCharacterZoneRankingsResponseItem {
  public name: string;
  public role: RaidPlayerRole;
  public classFileName: string; // TODO: Use class enum
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
  public raidZoneAndSize: RaidZoneAndSize;

  public lastUpdatedChanging: boolean = false;

  constructor(player: JsonRaidPlayer, raidZoneAndSize: RaidZoneAndSize) {
    this.name = player.name;
    this.characterName = player.name; // FIXME: Shouldn't be duplicated
    this.role = player.role;
    this.classFileName = player.classFileName;
    this.metric = this.getMetricFromRole(player.role);
    this.raidZoneAndSize = raidZoneAndSize;
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
