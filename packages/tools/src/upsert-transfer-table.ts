import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoRepository } from './dynamo-repository';
import { ITableItem } from './table-item';

export async function upsertTransfer(sourceTableName: string, targetTableName: string): Promise<void> {
  const dynamo: DynamoRepository<ITableItem> = new DynamoRepository();

  const sourceItems = await dynamo.getAllItems(sourceTableName);
  const targetItems = await dynamo.getAllItems(targetTableName);
  const targetByPK: { [key: string]: ITableItem } = {};
  targetItems.forEach((item: ITableItem) => {
    const key = item.regionServerCharacterName + item.zoneAndSize;
    targetByPK[key] = item;
  });

  console.log('sourceItems', sourceItems.length);
  console.log('targetItems', targetItems.length);
  const toInsert: ITableItem[] = [];
  const toUpdate: ITableItem[] = [];
  let skippedByTimestamp = 0;
  let matches = 0;
  sourceItems.forEach((item) => {
    const key = item.regionServerCharacterName + item.zoneAndSize;
    if (targetByPK[key]) {
      matches++;
      const sourceTs = item.timestamp;
      const targetTs = targetByPK[key].timestamp;
      if (sourceTs > targetTs) {
        toUpdate.push(item);
      } else {
        console.log('skippedByTimestamp', key);
        skippedByTimestamp++;
      }
    } else {
      toInsert.push(item);
    }
  });
  console.log('matches', matches);
  console.log('toInsert', toInsert.length);
  console.log('toUpdate', toUpdate.length);
  console.log('skippedByTimestamp', skippedByTimestamp);

  toInsert.forEach(async (insertRecord) => {
    await dynamo.insert(targetTableName, insertRecord);
  });

  toUpdate.forEach(async (updateRecord) => {
    console.log('updating record', {
      regionServerCharacterName: updateRecord.regionServerCharacterName,
      zoneAndSize: updateRecord.zoneAndSize
    });
    await dynamo.documentClient.send(
      new UpdateCommand({
        TableName: targetTableName,
        Key: {
          regionServerCharacterName: updateRecord.regionServerCharacterName,
          zoneAndSize: updateRecord.zoneAndSize
        },
        ExpressionAttributeNames: {
          '#tsVar': 'timestamp'
        },
        UpdateExpression: 'set #tsVar = :ts, wclResponse = :wcl',
        ExpressionAttributeValues: {
          ':ts': updateRecord.timestamp,
          ':wcl': updateRecord.wclResponse
        }
      })
    );
  });
}
