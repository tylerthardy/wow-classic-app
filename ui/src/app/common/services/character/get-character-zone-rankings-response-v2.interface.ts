import { IGetCharacterZoneRankingsResponseV2Ranking } from './get-character-zone-rankings-response-v2-ranking.interface';

// FIXME: Duplicated from the API
export interface IGetCharacterZoneRankingsResponseV2 {
  characterName: string;
  warcraftLogsClassId?: number;
  bestPerformanceAverage?: number;
  medianPerformanceAverage?: number;
  encounters?: IGetCharacterZoneRankingsResponseV2Ranking[];
}
