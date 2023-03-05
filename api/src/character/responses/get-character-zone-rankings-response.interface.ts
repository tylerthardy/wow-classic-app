import { IGetCharacterZoneRankingsResponseRanking } from '../../../../models';

// FIXME: Duplicated in the UI
export interface IGetCharacterZoneRankingsResponse {
  characterName: string;
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
