import { IGetCharacterZoneRankingsResponseRanking } from './get-character-zone-rankings-response-ranking.interface';

export interface IGetCharacterZoneRankingsResponse {
  characterName: string;
  warcraftLogsClassId?: number;
  bestPerformanceAverage?: number;
  medianPerformanceAverage?: number;
  encounters?: IGetCharacterZoneRankingsResponseRanking[];
}
