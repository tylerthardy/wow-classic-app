import { RankingMetric, ZoneEncounterRanking } from '../../warcraft-logs/common';
import { IGetWclCharacterZoneRankingsResponse } from '../../warcraft-logs/responses/get-wcl-character-zone-rankings-response.interface';
import { ZoneRankingParser } from '../common/zone-ranking-parser';
import { GetCharacterZoneRankingsRequest } from '../requests';
import { IGetMultipleCharacterZoneRankingsResponseItem } from './get-multiple-character-zone-rankings-response.interface';

export class GetMultipleCharacterZoneRankingsResponseItem implements IGetMultipleCharacterZoneRankingsResponseItem {
  public characterName: string;
  public metric: RankingMetric;
  public classFileName: string;
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
    wclCharacterData: IGetWclCharacterZoneRankingsResponse,
    errors: any[]
  ) {
    this.characterName = query.characterName;
    this.metric = query.metric;
    this.classFileName = query.classFileName;
    this.errors = errors;
    if (wclCharacterData) {
      this.warcraftLogsClassId = wclCharacterData.classID;
      this.bestPerformanceAverage = wclCharacterData.zoneRankings.bestPerformanceAverage;
      this.medianPerformanceAverage = wclCharacterData.zoneRankings.medianPerformanceAverage;

      const encounterRankings: ZoneEncounterRanking[] = ZoneRankingParser.filterUnrankedEncounters(
        wclCharacterData.zoneRankings.rankings
      );

      this.bestProgress = ZoneRankingParser.getBestProgress(encounterRankings);
      this.maxPossibleProgress = encounterRankings.length;

      const hardModes: string[] = ZoneRankingParser.getHardModes(encounterRankings);
      this.bestHardModeProgress = hardModes.length;
      this.hardModes = hardModes;
      this.maxPossibleHardmodes = ZoneRankingParser.getHardModeCount(wclCharacterData.zoneRankings.zone);
    }
  }
}
