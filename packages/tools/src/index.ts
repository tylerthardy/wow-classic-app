import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
  UpdateCommand
} from '@aws-sdk/lib-dynamodb';
import { ITableItem } from './table-item';

console.log('hello world');

const configuration: DynamoDBClientConfig = {};
const ddbClient = new DynamoDBClient(configuration);
const documentClient = DynamoDBDocumentClient.from(ddbClient);

const targetTableName: string = 'classic-companion-api-player16793775990BCFB33B-AEJ32QWHPIC6';
const sourceTableName: string = 'classic-companion-api-player16793775990BCFB33B-B2WMYB4Q55J';

async function getOneItem(tableName: string): Promise<any> {
  const scanParams: ScanCommandInput = {
    TableName: tableName,
    Limit: 1
  };
  console.log('requesting scan', scanParams);
  let result: ScanCommandOutput = await documentClient.send(new ScanCommand(scanParams));

  return result.Items ? result.Items[0] : undefined;
}

async function getAllItems(tableName: string): Promise<ITableItem[]> {
  console.log('getting all items from table ' + tableName);
  let result: ScanCommandOutput;
  let accumulated: any[] = [];
  let ExclusiveStartKey;

  do {
    const scanParams: ScanCommandInput = {
      TableName: tableName,
      ExclusiveStartKey
    };
    console.log('requesting scan', scanParams);
    result = await documentClient.send(new ScanCommand(scanParams));
    console.log('scan complete', {
      length: result.Items?.length,
      key: result.LastEvaluatedKey
    });

    ExclusiveStartKey = result.LastEvaluatedKey;
    if (result.Items) {
      accumulated = [...accumulated, ...result.Items];
    }
    console.log('accumulated', accumulated.length);
  } while (result.LastEvaluatedKey);

  return accumulated as ITableItem[];
}

(async () => {
  const sourceItems = await getAllItems(sourceTableName);
  const targetItems = await getAllItems(targetTableName);
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
    console.log('inserting record', {
      regionServerCharacterName: insertRecord.regionServerCharacterName,
      zoneAndSize: insertRecord.zoneAndSize
    });
    await documentClient.send(
      new PutCommand({
        TableName: targetTableName,
        Item: insertRecord
      })
    );
  });

  toUpdate.forEach(async (updateRecord) => {
    console.log('updating record', {
      regionServerCharacterName: updateRecord.regionServerCharacterName,
      zoneAndSize: updateRecord.zoneAndSize
    });
    await documentClient.send(
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
})();
