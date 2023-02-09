import { ItemNote } from './common/item-note';

export interface UpdateSoftresRequest {
  token: string;
  raid: {
    raidId: string;
    itemNotes: ItemNote[];
  };
}
