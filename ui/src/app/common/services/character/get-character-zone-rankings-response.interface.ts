import { IGetCharacterZoneRankingsResponseRanking } from './get-character-zone-rankings-response-ranking.interface';

// FIXME: Duplicated from the API
export interface IGetCharacterZoneRankingsResponse {
  characterName: string;
  warcraftLogsClassId?: number;
  bestPerformanceAverage?: number;
  medianPerformanceAverage?: number;
  encounters?: IGetCharacterZoneRankingsResponseRanking[];
  hardModes?: string[];
  bestHardModeProgress?: number;
  maxPossibleHardmodes?: number;
}
