export interface IGetCharacterZoneRankingsResponseV2Ranking {
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
