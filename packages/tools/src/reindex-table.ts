import { DynamoRepository } from './dynamo-repository';
import { ITableItem } from './table-item';

export interface ITableItemFactionIndex {
  regionServerFactionName: string;
  zoneAndSize: string;
  timestamp: string;
  wclResponse: string;
}

export async function reindexTable(sourceTableName: string, targetTableName: string): Promise<void> {
  const dynamo: DynamoRepository<ITableItem> = new DynamoRepository();

  const sourceItems = await dynamo.getAllItems(sourceTableName);
  const targetItems = await dynamo.getAllItems(targetTableName);

  console.log('sourceItems', sourceItems.length);
  console.log('targetItems', targetItems.length);

  if (targetItems.length > 0) {
    throw new Error('items exist in target table');
  }

  sourceItems.forEach(async (sourceItem) => {
    const faction: string = 'alliance';
    const newItemPrimaryKey: string = `${sourceItem.regionServerCharacterName}-${faction}`;
    const newItem: ITableItemFactionIndex = {
      regionServerFactionName: newItemPrimaryKey,
      timestamp: sourceItem.timestamp,
      wclResponse: sourceItem.wclResponse,
      zoneAndSize: sourceItem.zoneAndSize
    };
    await dynamo.insert(targetTableName, newItem);
  });
}
