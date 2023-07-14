import { RaidAndSizeSelection } from '../../components/instance-size-selection/raid-and-size-selection';
import { ItemData } from '../../item-data.interface';

// TODO: This is not Raid, this is SoftresRaid
export interface Raid {
  raidAndSize: RaidAndSizeSelection;
  hardReserveItem?: ItemData;
  hardReserveRecipient?: string;
  softReserveCount?: number;
}
