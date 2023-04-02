import { RankingMetric } from '../../../warcraft-logs/ranking-metric.type';

export interface IGetCharacterZoneRankingsResponse {
  characterName: string;
  metric: RankingMetric;
  lastUpdated: number;
  role?: string;
  warcraftLogsClassId?: number;
  bestPerformanceAverage?: number;
  medianPerformanceAverage?: number;
  encounters?: IGetCharacterZoneRankingsResponseRanking[];
  hardModes?: string[];
  bestHardModeProgress?: number;
  maxPossibleHardmodes?: number;
  size?: number;
}

export interface IGetCharacterZoneRankingsResponseRanking {
  encounterName: string;
  encounterId: number;
  lockedIn: boolean;
  bestPercent?: number;
  bestSpec?: string;
  medianPercent?: number;
  highestAmount?: number;
  kills?: number;
  fastest?: number;
  highestDifficulty?: string;
}
