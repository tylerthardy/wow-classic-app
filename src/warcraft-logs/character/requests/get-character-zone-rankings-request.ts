import { RaidSize, RankingMetric } from '../../common';

export interface GetCharacterZoneRankingsRequest {
  characterName: string;
  serverSlug: string;
  serverRegion: string;
  zoneId: number;
  metric: RankingMetric;
  size: RaidSize;
}
