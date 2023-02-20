import { RaidSize } from '../raids/raid-size.type';
import { RankingMetric } from './Metric';

export interface ZoneRankingsQuery {
  characterName: string;
  serverSlug: string;
  serverRegion: string;
  zoneId: number;
  metric: RankingMetric;
  classFileName?: string;
  size: RaidSize;
}
