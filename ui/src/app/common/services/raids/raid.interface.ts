import { RaidAndSizeSelection } from '../../components/raid-size-selection/raid-and-size-selection';
import { ItemData } from '../../item-data.interface';

export interface Raid {
  raidAndSize: RaidAndSizeSelection;
  hardReserveItem?: ItemData;
  hardReserveRecipient?: string;
  softReserveCount?: number;
}
