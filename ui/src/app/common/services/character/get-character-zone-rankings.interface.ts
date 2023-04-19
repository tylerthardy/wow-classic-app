import { RankingMetric } from 'classic-companion-core';
import { RaidSize } from '../raids/raid-size.type';

export interface IGetCharacterZoneRankings {
  // omit server slug and region because service adds these on
  characterName: string;
  zoneId: number;
  metric: RankingMetric;
  classSlug?: string;
  role?: string;
  specName?: string;
  size: RaidSize;
}
