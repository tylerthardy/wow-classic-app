import { IGetCharacterZoneRankingsResponse, IGetCharacterZoneRankingsResponseRanking } from '../../../../models/api';
import { ZoneEncounterRanking } from '../../../../models/warcraft-logs';
import { GetWclCharacterZoneRankingsResponse } from '../../warcraft-logs/models/get-wcl-character-zone-rankings-response.interface';
import { GetCharacterZoneRankingsResponseRanking } from './get-character-zone-rankings-response-ranking';

export class GetCharacterZoneRankingsResponse implements IGetCharacterZoneRankingsResponse {
  public characterName: string;
  public warcraftLogsClassId?: number;
  public bestPerformanceAverage?: number;
  public medianPerformanceAverage?: number;
  public encounters?: IGetCharacterZoneRankingsResponseRanking[];

  constructor(wclCharacterData: GetWclCharacterZoneRankingsResponse) {
    this.characterName = wclCharacterData.name;
    this.warcraftLogsClassId = wclCharacterData.classID;
    this.bestPerformanceAverage = wclCharacterData.zoneRankings.bestPerformanceAverage;
    this.medianPerformanceAverage = wclCharacterData.zoneRankings.medianPerformanceAverage;

    const FLAME_LEVIATHAN_ENCOUNTER_ID: number = 744;
    const encounterRankings: ZoneEncounterRanking[] = wclCharacterData.zoneRankings.rankings.filter(
      (encounterRanking) => encounterRanking.encounter.id !== FLAME_LEVIATHAN_ENCOUNTER_ID
    );
    this.encounters = encounterRankings.map((ranking) => new GetCharacterZoneRankingsResponseRanking(ranking));
  }
}
