import { RankingMetric } from '../../warcraft-logs/common';
import { IGetCharacterZoneRankingsResponseV2Ranking } from './get-character-zone-rankings-response-v2-ranking.interface';

// FIXME: Duplicated in the UI
export interface IGetCharacterZoneRankingsResponseV2 {
  characterName: string;
  metric: RankingMetric;
  role?: string;
  warcraftLogsClassId?: number;
  bestPerformanceAverage?: number;
  medianPerformanceAverage?: number;
  encounters?: IGetCharacterZoneRankingsResponseV2Ranking[];
  hardModes?: string[];
  bestHardModeProgress?: number;
  maxPossibleHardmodes?: number;
  size?: number;
}
