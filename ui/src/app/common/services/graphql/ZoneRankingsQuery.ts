import { RankingMetric } from 'classic-companion-core';
import { RaidSize } from '../raids/raid-size.type';

export interface ZoneRankingsQuery {
  characterName: string;
  serverSlug: string;
  serverRegion: string;
  zoneId: number;
  metric: RankingMetric;
  classFileName?: string;
  role?: string;
  specName?: string;
  size: RaidSize;
}
