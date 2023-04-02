import { RankingMetric } from 'classic-companion-core';
import { RaidSize } from '../../warcraft-logs/common';

export interface IGetCharacterZoneRankingsRequest {
  characterName: string;
  serverSlug: string;
  serverRegion: string;
  zoneId: number;
  metric: RankingMetric;
  classFileName?: string;
  specName?: string;
  size: RaidSize;
}
