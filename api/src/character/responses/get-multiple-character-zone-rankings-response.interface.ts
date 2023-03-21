import { RankingMetric } from '../../warcraft-logs/common';

export interface IGetMultipleCharacterZoneRankingsResponse {
  characters: IGetMultipleCharacterZoneRankingsResponseItem[];
}

export interface IGetMultipleCharacterZoneRankingsResponseItem {
  characterName: string;
  metric: RankingMetric;
  lastUpdated?: number;
  warcraftLogsClassId?: number;
  bestPerformanceAverage?: number;
  medianPerformanceAverage?: number;
  bestProgress?: number;
  maxPossibleProgress?: number;
  bestHardModeProgress?: number;
  hardModes?: string[];
  maxPossibleHardmodes?: number;
  error?: any;
}
