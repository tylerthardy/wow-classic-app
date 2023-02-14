// FIXME: Duplicated from the API
export interface IGetCharacterZoneRankingsResponseRanking {
  encounterName: string;
  lockedIn: boolean;
  bestPercent?: number;
  bestSpec?: string;
  medianPercent?: number;
  highestAmount?: number;
  kills?: number;
  fastest?: number;
  highestDifficulty?: string;
}
