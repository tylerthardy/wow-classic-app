import { ItemData } from '../../item-data.interface';
import { SoftresRaidSlug } from '../softres/softres-raid-slug';

export interface Raid {
  instanceSlug: SoftresRaidSlug;
  hardReserveItem?: ItemData;
  hardReserveRecipient?: string;
  softReserveCount?: number;
}
