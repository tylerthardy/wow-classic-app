import { RankingMetric } from 'classic-companion-core';

export interface EncounterRankingsQuery {
  characterName: string;
  serverSlug: string;
  serverRegion: string;
  encounterId: number;
  metric: RankingMetric;
}
