import { InstanceSizeSelection } from '../../components/instance-size-selection/instance-size-selection';
import { ItemData } from '../../item-data.interface';

// TODO: This is not Raid, this is SoftresRaid
export interface Raid {
  instanceSizeSelection: InstanceSizeSelection;
  hardReserveItem?: ItemData;
  hardReserveRecipient?: string;
  softReserveCount?: number;
}
