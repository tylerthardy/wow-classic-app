import { IWowSimsExportItem } from 'classic-companion-core';
import { RankingMetric } from '../common/services/graphql';

export interface IStoredCharacter {
  name: string;
  metric: RankingMetric;
  gear: { items: (IWowSimsExportItem | null)[] };
  className: string;
  specName: string;
}
