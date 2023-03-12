import { IWowSimsExportItem } from '../common/gear/wowsims-export.interface';
import { RankingMetric } from '../common/services/graphql';

export interface ICharacter {
  name: string;
  metric: RankingMetric;
  gear: { items: IWowSimsExportItem[] };
}
