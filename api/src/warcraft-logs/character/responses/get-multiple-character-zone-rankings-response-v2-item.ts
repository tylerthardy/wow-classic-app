import { ZoneEncounterRanking } from '../../common';
import { GetCharacterZoneRankingsRequest } from '../requests';
import { GetCharacterZoneRankingsResponse } from './get-character-zone-rankings-response.interface';
import { IGetMultipleCharacterZoneRankingsResponseV2Item } from './get-multiple-character-zone-rankings-response-v2.interface';

export class GetMultipleCharacterZoneRankingsResponseV2Item implements IGetMultipleCharacterZoneRankingsResponseV2Item {
  public characterName: string;
  public metric: string;
  public warcraftLogsClassId?: number;
  public bestPerformanceAverage?: number;
  public medianPerformanceAverage?: number;
  public bestProgress?: number;
  public maxPossibleProgress?: number;
  public bestHardModeProgress?: number;
  public hardModes?: string[];
  public maxPossibleHardmodes?: number;

  constructor(query: GetCharacterZoneRankingsRequest, rankingData: GetCharacterZoneRankingsResponse) {
    this.characterName = query.characterName;
    this.metric = query.metric;
    if (rankingData) {
      this.warcraftLogsClassId = rankingData.classID;
      this.bestPerformanceAverage = rankingData.zoneRankings.bestPerformanceAverage;
      this.medianPerformanceAverage = rankingData.zoneRankings.medianPerformanceAverage;

      const FLAME_LEVIATHAN_ENCOUNTER_ID: number = 744;
      const encounterRankings: ZoneEncounterRanking[] = rankingData.zoneRankings.rankings.filter(
        (encounterRanking) => encounterRanking.encounter.id !== FLAME_LEVIATHAN_ENCOUNTER_ID
      );

      this.bestProgress = this.getBestProgress(encounterRankings);
      this.maxPossibleProgress = encounterRankings.length;

      const hardModes: string[] = this.getHardModes(encounterRankings);
      this.bestHardModeProgress = hardModes.length;
      this.hardModes = hardModes;
      this.maxPossibleHardmodes = this.getHardModeCount(rankingData.zoneRankings.zone);
    }
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

  private getBestProgress(encounterRankings: ZoneEncounterRanking[]): number {
    const killCount: number = encounterRankings.filter((ranking) => ranking.totalKills > 0).length;
    return killCount;
  }
}
