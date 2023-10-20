import { RankingMetric } from 'classic-companion-core';
import { RaidSize } from '../../warcraft-logs/common';

export interface IGetCharacterZoneRankingsRequest {
  characterName: string;
  serverSlug: string;
  serverRegion: string;
  zoneId: number;
  size: RaidSize;
  metric: RankingMetric;
  classSlug?: string;
  specName?: string;
  difficulty?: 'hard' | 'normal';
}
