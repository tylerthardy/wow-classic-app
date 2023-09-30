import {
  IGetMultipleCharacterZoneRankingsResponseItem,
  Instance,
  Instances,
  RankingMetric
} from 'classic-companion-core';
import { ZoneEncounterRanking } from '../../warcraft-logs/common';
import { IGetWclCharacterZoneRankingsResponse } from '../../warcraft-logs/responses/get-wcl-character-zone-rankings-response.interface';
import { ZoneRankingParser } from '../common/zone-ranking-parser';
import { GetCharacterZoneRankingsRequest } from '../requests';

// FIXME: Clean up these models. Maybe separate wcl concepts from things like lastUpdated, metric, characterName. Also size gets passed through.
export class GetMultipleCharacterZoneRankingsResponseItem implements IGetMultipleCharacterZoneRankingsResponseItem {
  public characterName: string;
  public metric: RankingMetric;
  public lastUpdated?: number;
  public classSlug: string;
  public role?: string;
  public warcraftLogsClassId?: number;
  public bestPerformanceAverage?: number;
  public medianPerformanceAverage?: number;
  public bestProgress?: number;
  public maxPossibleProgress?: number;
  public bestHardModeProgress?: number;
  public hardModes?: string[];
  public maxPossibleHardmodes?: number;
  public errors?: any[];

  constructor(
    query: GetCharacterZoneRankingsRequest,
    wclCharacterData: IGetWclCharacterZoneRankingsResponse | undefined,
    errors: any[]
  ) {
    this.characterName = query.characterName;
    this.metric = query.metric;
    this.classSlug = query.classSlug ?? 'UNKNOWN';
    this.role = query.role;
    this.errors = errors;
    if (wclCharacterData && wclCharacterData.zoneRankings) {
      if (!wclCharacterData.zoneRankings.error) {
        this.lastUpdated = wclCharacterData.lastUpdated;
        this.warcraftLogsClassId = wclCharacterData.classID;
        this.bestPerformanceAverage = wclCharacterData.zoneRankings.bestPerformanceAverage;
        this.medianPerformanceAverage = wclCharacterData.zoneRankings.medianPerformanceAverage;

        const encounterRankings: ZoneEncounterRanking[] = ZoneRankingParser.filterUnrankedEncounters(
          wclCharacterData.zoneRankings.rankings
        );

        const zoneId: number = wclCharacterData.zoneRankings.zone;
        this.bestProgress = ZoneRankingParser.getBestProgress(encounterRankings);
        this.maxPossibleProgress = encounterRankings.length;

        const hardModes: string[] = ZoneRankingParser.getHardModes(zoneId, encounterRankings);
        this.bestHardModeProgress = hardModes.length;
        this.hardModes = hardModes;
        this.maxPossibleHardmodes = this.getHardModeCount(zoneId);
      } else {
        if (wclCharacterData.zoneRankings.error === "You do not have permission to see this character's rankings.") {
          errors.push('Player has logs hidden');
        } else {
          errors.push(`zoneRankings error for ${query.characterName}: ${wclCharacterData.zoneRankings.error}`);
        }
      }
    }
  }

  private getHardModeCount(zoneId: number): number {
    const instance: Instance | undefined = Instances.getByZoneId(zoneId);
    if (!instance) {
      throw new Error('unknown zoneid ' + zoneId);
    }
    return instance.hardModeCount;
  }
}
