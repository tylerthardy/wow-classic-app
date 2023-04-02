import { IWowSimsExportItem, RankingMetric } from 'classic-companion-core';

export interface IStoredCharacter {
  name: string;
  metric: RankingMetric;
  gear: { items: (IWowSimsExportItem | null)[] };
  className: string;
  specName: string;
}
