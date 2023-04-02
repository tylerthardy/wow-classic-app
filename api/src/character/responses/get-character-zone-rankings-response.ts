import {
  IGetCharacterZoneRankingsResponse,
  IGetCharacterZoneRankingsResponseRanking,
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

  constructor(wclCharacterData: IGetWclCharacterZoneRankingsResponse) {
    this.characterName = wclCharacterData.name;
    this.metric = wclCharacterData.zoneRankings.metric;
    this.lastUpdated = wclCharacterData.lastUpdated;
    this.warcraftLogsClassId = wclCharacterData.classID;
    this.bestPerformanceAverage = wclCharacterData.zoneRankings.bestPerformanceAverage;
    this.medianPerformanceAverage = wclCharacterData.zoneRankings.medianPerformanceAverage;
    this.size = wclCharacterData.size;

    const encounterRankings: ZoneEncounterRanking[] = ZoneRankingParser.filterUnrankedEncounters(
      wclCharacterData.zoneRankings.rankings
    );
    this.encounters = encounterRankings.map((ranking) => new GetCharacterZoneRankingsResponseRanking(ranking));

    const hardModes: string[] = ZoneRankingParser.getHardModes(encounterRankings);
    this.bestHardModeProgress = hardModes.length;
    this.hardModes = hardModes;
    this.maxPossibleHardmodes = ZoneRankingParser.getHardModeCount(wclCharacterData.zoneRankings.zone);
  }
}
