import { RaidSize, RankingMetric } from '../../common';

export interface IGetCharacterZoneRankingsRequest {
  characterName: string;
  serverSlug: string;
  serverRegion: string;
  zoneId: number;
  metric: RankingMetric;
  size: RaidSize;
}
