import { allItems } from './all-items';
import { ItemData } from './common/item-data.interface';

const allItemsByIdParsed: { [id: number]: ItemData[] } = {};
allItems.forEach((item: ItemData) => {
  if (allItemsByIdParsed[item.id]) {
    allItemsByIdParsed[item.id].push(item);
  } else {
    allItemsByIdParsed[item.id] = [item];
  }
});
export const allItemsById: { [id: number]: ItemData[] } = allItemsByIdParsed;
