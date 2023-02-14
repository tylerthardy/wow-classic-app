import { IGetCharacterZoneRankingsResponseV2Ranking } from './get-character-zone-rankings-response-v2-ranking.interface';

export interface IGetCharacterZoneRankingsResponseV2 {
  characterName: string;
  warcraftLogsClassId?: number;
  bestPerformanceAverage?: number;
  medianPerformanceAverage?: number;
  encounters?: IGetCharacterZoneRankingsResponseV2Ranking[];
}
