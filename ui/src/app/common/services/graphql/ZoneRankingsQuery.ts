import { RaidSize } from '../raids/raid-size.type';
import { Metric } from './Metric';

export interface ZoneRankingsQuery {
  characterName: string;
  serverSlug: string;
  serverRegion: string;
  zoneId: number;
  metric: Metric;
  size: RaidSize;
}
