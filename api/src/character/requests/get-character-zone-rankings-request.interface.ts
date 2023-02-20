import { RaidSize, RankingMetric } from '../../warcraft-logs/common';

export interface IGetCharacterZoneRankingsRequest {
  characterName: string;
  serverSlug: string;
  serverRegion: string;
  zoneId: number;
  metric: RankingMetric;
  classFileName?: string;
  size: RaidSize;
}
