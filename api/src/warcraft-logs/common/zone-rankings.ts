import { RankingMetric } from 'classic-companion-core';
import { AllStar } from './all-star';
import { ZoneEncounterRanking } from './zone-encounter-ranking';

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
