import { Metric } from './Metric';

export interface EncounterRankingsQuery {
  characterName: string;
  serverSlug: string;
  serverRegion: string;
  encounterId: number;
  metric: Metric;
}
