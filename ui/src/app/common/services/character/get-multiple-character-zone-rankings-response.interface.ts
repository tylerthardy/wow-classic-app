// FIXME: Duplicated from the API
export interface IGetMultipleCharacterZoneRankingsResponse {
  characters: IGetMultipleCharacterZoneRankingsResponseItem[];
}

export interface IGetMultipleCharacterZoneRankingsResponseItem {
  characterName: string;
  metric: 'dps' | 'hps';
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
