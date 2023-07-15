import { RaidSize, RankingMetric } from 'classic-companion-core';

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
