import { RaidAndSizeSelection } from '../../components/raid-size-selection/raid-size-selection.component';
import { ItemData } from '../../item-data.interface';

export interface Raid {
  raidAndSize: RaidAndSizeSelection;
  hardReserveItem?: ItemData;
  hardReserveRecipient?: string;
  softReserveCount?: number;
}
