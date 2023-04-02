import { RaidSize } from '../../../common/raid-size';
import { RankingMetric } from '../../../warcraft-logs';

export interface IGetCharacterZoneRankingsRequest {
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
