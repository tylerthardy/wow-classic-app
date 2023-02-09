import { Character } from './Character';
import { CharacterRank } from './CharacterRank';

export interface CharacterEncounterRankings extends Character {
  encounterRankings: {
    bestAmount: number;
    medianPerformance: number;
    averagePerformance: number;
    totalKills: number;
    ranks: CharacterRank[];
  };
}
