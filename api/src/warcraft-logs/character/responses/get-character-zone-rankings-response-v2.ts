import { ZoneEncounterRanking } from '../../common';
import { GetCharacterZoneRankingsResponseV2Ranking } from './get-character-zone-rankings-response-v2-ranking';
import { IGetCharacterZoneRankingsResponseV2Ranking } from './get-character-zone-rankings-response-v2-ranking.interface';
import { IGetCharacterZoneRankingsResponseV2 } from './get-character-zone-rankings-response-v2.interface';
import { GetCharacterZoneRankingsResponse } from './get-character-zone-rankings-response.interface';

export class GetCharacterZoneRankingsV2Response implements IGetCharacterZoneRankingsResponseV2 {
  public characterName: string;
  public warcraftLogsClassId?: number;
  public bestPerformanceAverage?: number;
  public medianPerformanceAverage?: number;
  public encounters?: IGetCharacterZoneRankingsResponseV2Ranking[];

  constructor(characterData: GetCharacterZoneRankingsResponse) {
    this.characterName = characterData.name;
    this.warcraftLogsClassId = characterData.classID;
    this.bestPerformanceAverage = characterData.zoneRankings.bestPerformanceAverage;
    this.medianPerformanceAverage = characterData.zoneRankings.medianPerformanceAverage;

    const FLAME_LEVIATHAN_ENCOUNTER_ID: number = 744;
    const encounterRankings: ZoneEncounterRanking[] = characterData.zoneRankings.rankings.filter(
      (encounterRanking) => encounterRanking.encounter.id !== FLAME_LEVIATHAN_ENCOUNTER_ID
    );
    this.encounters = encounterRankings.map((ranking) => new GetCharacterZoneRankingsResponseV2Ranking(ranking));
  }
}
