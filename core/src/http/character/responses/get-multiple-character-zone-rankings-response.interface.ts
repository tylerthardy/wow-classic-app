import { RankingMetric } from '../../../warcraft-logs';

export interface IGetMultipleCharacterZoneRankingsResponse {
  characters: IGetMultipleCharacterZoneRankingsResponseItem[];
}

export interface IGetMultipleCharacterZoneRankingsResponseItem {
  characterName: string;
  role?: string;
  metric: RankingMetric;
  lastUpdated?: number;
  classFileName: string;
  warcraftLogsClassId?: number;
  bestPerformanceAverage?: number;
  medianPerformanceAverage?: number;
  bestProgress?: number;
  maxPossibleProgress?: number;
  bestHardModeProgress?: number;
  hardModes?: string[];
  maxPossibleHardmodes?: number;
  errors?: any[];
}
