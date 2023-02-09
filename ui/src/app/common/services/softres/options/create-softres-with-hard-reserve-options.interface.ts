import { ItemData } from '../../../item-data.interface';
import { CreateSoftresOptions } from './create-softres-options.interface';

export interface CreateSoftresWithHardReserveOptions extends CreateSoftresOptions {
  hardReserveItem: ItemData;
  hardReserveRecipient: string;
}
