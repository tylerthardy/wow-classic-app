import { RankingMetric, ZoneEncounterRanking } from '../../warcraft-logs/common';
import { IGetWclCharacterZoneRankingsResponse } from '../../warcraft-logs/responses/get-wcl-character-zone-rankings-response.interface';
import { ZoneRankingParser } from '../common/zone-ranking-parser';
import { GetCharacterZoneRankingsResponseV2Ranking } from './get-character-zone-rankings-response-v2-ranking';
import { IGetCharacterZoneRankingsResponseV2Ranking } from './get-character-zone-rankings-response-v2-ranking.interface';
import { IGetCharacterZoneRankingsResponseV2 } from './get-character-zone-rankings-response-v2.interface';

// FIXME: Clean up these models. Maybe separate wcl concepts from things like lastUpdated, metric, characterName. Also size gets passed through.
export class GetCharacterZoneRankingsV2Response implements IGetCharacterZoneRankingsResponseV2 {
  public characterName: string;
  public metric: RankingMetric;
  public lastUpdated: number;
  public warcraftLogsClassId?: number;
  public bestPerformanceAverage?: number;
  public medianPerformanceAverage?: number;
  public encounters?: IGetCharacterZoneRankingsResponseV2Ranking[];
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
    this.encounters = encounterRankings.map((ranking) => new GetCharacterZoneRankingsResponseV2Ranking(ranking));

    const hardModes: string[] = ZoneRankingParser.getHardModes(encounterRankings);
    this.bestHardModeProgress = hardModes.length;
    this.hardModes = hardModes;
    this.maxPossibleHardmodes = ZoneRankingParser.getHardModeCount(wclCharacterData.zoneRankings.zone);
  }
}
