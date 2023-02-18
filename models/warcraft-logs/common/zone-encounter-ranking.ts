import { AllStar } from './all-star';

export interface ZoneEncounterRanking {
  encounter: {
    id: number;
    name: string;
  };
  rankPercent: number;
  medianPercent: number;
  lockedIn: boolean;
  totalKills: number;
  fastestKill: number;
  allStars: AllStar;
  spec: string;
  bestSpec: string;
  bestAmount: number;
}
