import { ZoneEncounterRanking } from '../../warcraft-logs/common';
import { IGetWclCharacterZoneRankingsResponse } from '../../warcraft-logs/responses/get-wcl-character-zone-rankings-response.interface';
import { ZoneRankingParser } from '../common/zone-ranking-parser';
import { GetCharacterZoneRankingsResponseV2Ranking } from './get-character-zone-rankings-response-v2-ranking';
import { IGetCharacterZoneRankingsResponseV2Ranking } from './get-character-zone-rankings-response-v2-ranking.interface';
import { IGetCharacterZoneRankingsResponseV2 } from './get-character-zone-rankings-response-v2.interface';

export class GetCharacterZoneRankingsV2Response implements IGetCharacterZoneRankingsResponseV2 {
  public characterName: string;
  public warcraftLogsClassId?: number;
  public bestPerformanceAverage?: number;
  public medianPerformanceAverage?: number;
  public encounters?: IGetCharacterZoneRankingsResponseV2Ranking[];
  public hardModes?: string[];
  public bestHardModeProgress?: number;
  public maxPossibleHardmodes?: number;

  constructor(wclCharacterData: IGetWclCharacterZoneRankingsResponse) {
    this.characterName = wclCharacterData.name;
    this.warcraftLogsClassId = wclCharacterData.classID;
    this.bestPerformanceAverage = wclCharacterData.zoneRankings.bestPerformanceAverage;
    this.medianPerformanceAverage = wclCharacterData.zoneRankings.medianPerformanceAverage;

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
