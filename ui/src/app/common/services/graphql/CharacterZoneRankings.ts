import { AllStar, Character, RankingMetric, ZoneEncounterRanking } from './';

export interface CharacterZoneRankings extends Character {
  zoneRankings: ZoneRankings;
}

export interface ZoneRankings {
  bestPerformanceAverage: number;
  medianPerformanceAverage: number;
  difficulty: number; // unknown
  metric: RankingMetric;
  partition: number; // phase
  zone: number;
  allStars: AllStar[];
  rankings: ZoneEncounterRanking[];
}
