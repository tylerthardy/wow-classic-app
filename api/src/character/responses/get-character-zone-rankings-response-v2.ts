import { ZoneEncounterRanking } from '../../warcraft-logs/common';
import { GetWclCharacterZoneRankingsResponse } from '../../warcraft-logs/service/get-wcl-character-zone-rankings-response.interface';
import { GetCharacterZoneRankingsResponseV2Ranking } from './get-character-zone-rankings-response-v2-ranking';
import { IGetCharacterZoneRankingsResponseV2Ranking } from './get-character-zone-rankings-response-v2-ranking.interface';
import { IGetCharacterZoneRankingsResponseV2 } from './get-character-zone-rankings-response-v2.interface';

export class GetCharacterZoneRankingsV2Response implements IGetCharacterZoneRankingsResponseV2 {
  public characterName: string;
  public warcraftLogsClassId?: number;
  public bestPerformanceAverage?: number;
  public medianPerformanceAverage?: number;
  public encounters?: IGetCharacterZoneRankingsResponseV2Ranking[];

  constructor(wclCharacterData: GetWclCharacterZoneRankingsResponse) {
    this.characterName = wclCharacterData.name;
    this.warcraftLogsClassId = wclCharacterData.classID;
    this.bestPerformanceAverage = wclCharacterData.zoneRankings.bestPerformanceAverage;
    this.medianPerformanceAverage = wclCharacterData.zoneRankings.medianPerformanceAverage;

    const FLAME_LEVIATHAN_ENCOUNTER_ID: number = 744;
    const encounterRankings: ZoneEncounterRanking[] = wclCharacterData.zoneRankings.rankings.filter(
      (encounterRanking) => encounterRanking.encounter.id !== FLAME_LEVIATHAN_ENCOUNTER_ID
    );
    this.encounters = encounterRankings.map((ranking) => new GetCharacterZoneRankingsResponseV2Ranking(ranking));
  }
}
