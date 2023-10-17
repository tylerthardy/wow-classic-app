import {
  IGetCharacterZoneRankingsResponse,
  IGetCharacterZoneRankingsResponseRanking,
  Instance,
  Instances,
  RankingMetric
} from 'classic-companion-core';
import { ZoneEncounterRanking } from '../../warcraft-logs/common';
import { IGetWclCharacterZoneRankingsResponse } from '../../warcraft-logs/responses/get-wcl-character-zone-rankings-response.interface';
import { ZoneRankingParser } from '../common/zone-ranking-parser';
import { GetCharacterZoneRankingsResponseRanking } from './get-character-zone-rankings-response-ranking';

// FIXME: Clean up these models. Maybe separate wcl concepts from things like lastUpdated, metric, characterName. Also size gets passed through.
export class GetCharacterZoneRankingsResponse implements IGetCharacterZoneRankingsResponse {
  public characterName: string;
  public metric: RankingMetric;
  public lastUpdated: number;
  public warcraftLogsClassId?: number;
  public bestPerformanceAverage?: number;
  public medianPerformanceAverage?: number;
  public encounters?: IGetCharacterZoneRankingsResponseRanking[];
  public hardModes?: string[];
  public bestHardModeProgress?: number;
  public maxPossibleHardmodes?: number;
  public size?: number;
  public zoneId?: number;
  public difficulty?: number;

  constructor(wclCharacterData: IGetWclCharacterZoneRankingsResponse) {
    this.characterName = wclCharacterData.name;
    this.metric = wclCharacterData.zoneRankings.metric;
    this.lastUpdated = wclCharacterData.lastUpdated;
    this.warcraftLogsClassId = wclCharacterData.classID;
    this.bestPerformanceAverage = wclCharacterData.zoneRankings.bestPerformanceAverage;
    this.medianPerformanceAverage = wclCharacterData.zoneRankings.medianPerformanceAverage;
    this.size = wclCharacterData.size;
    this.zoneId = wclCharacterData.zoneRankings.zone;
    this.difficulty = wclCharacterData.zoneRankings.difficulty;

    if (wclCharacterData.zoneRankings.rankings) {
      const encounterRankings: ZoneEncounterRanking[] = ZoneRankingParser.filterUnrankedEncounters(
        wclCharacterData.zoneRankings.rankings
      );
      this.encounters = encounterRankings.map((ranking) => new GetCharacterZoneRankingsResponseRanking(ranking));

      const hardModes: string[] = ZoneRankingParser.getHardModes(this.zoneId, encounterRankings);
      this.bestHardModeProgress = hardModes.length;
      this.hardModes = hardModes;
      this.maxPossibleHardmodes = this.getHardModeCount(this.zoneId);
    }
  }

  public appendHardModes_ICC(rankings: IGetWclCharacterZoneRankingsResponse): void {
    this.bestHardModeProgress = 0;
    this.hardModes = [];
    for (const ranking of rankings.zoneRankings.rankings) {
      if (ranking.totalKills <= 0) {
        continue;
      }
      // Add to hardmode count & collection
      this.hardModes.push(ranking.encounter.name);
      this.bestHardModeProgress += 1;

      // Overwrite the normal encounter with hard
      const normalRankingIndex: number = this.encounters!.findIndex(
        (encounter) => encounter.encounterId === ranking.encounter.id
      );
      if (normalRankingIndex === -1) {
        throw new Error('No normal ranking found to map hard mode encounter');
      }
      const hardModeEncounter: GetCharacterZoneRankingsResponseRanking = new GetCharacterZoneRankingsResponseRanking(
        ranking
      );
      hardModeEncounter.highestDifficulty = 'Hard Mode';
      this.encounters![normalRankingIndex] = hardModeEncounter;
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
