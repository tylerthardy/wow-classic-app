import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput
} from '@aws-sdk/lib-dynamodb';

export class DynamoRepository<T> {
  private configuration: DynamoDBClientConfig = {};
  private ddbClient = new DynamoDBClient(this.configuration);
  public documentClient = DynamoDBDocumentClient.from(this.ddbClient);

  public async getAllItems(tableName: string): Promise<T[]> {
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
      result = await this.documentClient.send(new ScanCommand(scanParams));
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

    return accumulated as T[];
  }

  public async getOneItem(tableName: string): Promise<T | undefined> {
    const scanParams: ScanCommandInput = {
      TableName: tableName,
      Limit: 1
    };
    console.log('requesting scan', scanParams);
    let result: ScanCommandOutput = await this.documentClient.send(new ScanCommand(scanParams));

    return result.Items ? (result.Items[0] as T) : undefined;
  }

  public async insert<T>(tableName: string, item: T): Promise<void> {
    console.log('inserting record', {
      tableName,
      item
    });
    await this.documentClient.send(
      new PutCommand({
        TableName: tableName,
        Item: item as Record<string, any>
      })
    );
  }
}
