import { ItemData } from '../common/item-data.interface';
import { SoftresRaidSlug } from '../common/services/softres/softres-raid-slug';

export interface CreateSoftresModalData {
  raid: SoftresRaidSlug;
  hardReserveItem?: ItemData;
  hardReserveRecipient?: string;
}
