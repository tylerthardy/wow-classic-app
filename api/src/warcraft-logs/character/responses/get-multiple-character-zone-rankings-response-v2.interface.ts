export interface IGetMultipleCharacterZoneRankingsResponseV2 {
  characters: IGetMultipleCharacterZoneRankingsResponseV2Item[];
}

export interface IGetMultipleCharacterZoneRankingsResponseV2Item {
  characterName: string;
  metric: string;
  warcraftLogsClassId?: number;
  bestPerformanceAverage?: number;
  medianPerformanceAverage?: number;
  bestProgress?: number;
  maxPossibleProgress?: number;
  bestHardModeProgress?: number;
  hardModes?: string[];
  maxPossibleHardmodes?: number;
}
